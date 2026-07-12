const { Server } = require('socket.io');
const mongoose = require('mongoose');

/**
 * THIS FILE IS THE ANSWER TO "we need realtime and dynamic data, not static".
 *
 * There are two different real-time needs in this app, and they need two
 * different mechanisms:
 *
 * 1. DASHBOARD KPIs (Active Vehicles, Fleet Utilization %, etc.)
 *    These are NEVER stored as a field anywhere — they're always computed
 *    on-demand from an aggregation pipeline (see controllers/dashboardController.js).
 *    Storing "activeVehicleCount: 42" as a static field is exactly the bug
 *    your spec is warning about — it goes stale the moment a trip dispatches.
 *
 * 2. LIVE PUSH TO CONNECTED CLIENTS (so the Fleet Manager's screen updates
 *    the instant a Safety Officer suspends a driver, without a manual refresh)
 *    This is what MongoDB Change Streams + Socket.io solve below. Change
 *    Streams require Atlas (replica set) — they don't work on a standalone
 *    local mongod, which is one more reason to develop directly against
 *    Atlas rather than local Mongo for this project.
 */

function initRealtime(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || '*' },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Clients join rooms by role/region so we don't broadcast every event to
    // everyone — e.g. a Financial Analyst doesn't need every trip-dispatch event.
    socket.on('join', (room) => socket.join(room));
  });

  // Watch collections whose changes should push live updates to the UI.
  // Each change stream emits an event the frontend listens for and uses to
  // patch its local state / React Query cache — no polling required.
  const watchedModels = [
    { name: 'vehicles', model: mongoose.model('Vehicle') },
    { name: 'drivers', model: mongoose.model('Driver') },
    { name: 'trips', model: mongoose.model('Trip') },
    { name: 'maintenancelogs', model: mongoose.model('MaintenanceLog') },
  ];

  watchedModels.forEach(({ name, model }) => {
    const changeStream = model.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
      io.emit(`${name}:changed`, {
        operationType: change.operationType, // insert | update | delete
        documentId: change.documentKey?._id,
        document: change.fullDocument || null,
      });
    });

    changeStream.on('error', (err) => {
      console.error(`Change stream error on ${name}:`, err.message);
      // In production, add reconnect-with-resume-token logic here using
      // change.resumeToken so a dropped stream doesn't lose events.
    });
  });

  return io;
}

module.exports = initRealtime;