var m = require('mithril');
var groundBuild = require('./ground');
var generate = require('./calc/generate');
var diagram = require('./calc/diagram');
var fendata = require('./calc/fendata');
var queryparam = require('./util/queryparam');

module.exports = function(opts, i18n) {

  var fen = m.prop(opts.fen);
  var features = m.prop(generate.extractFeatures(fen()));
  var ground;

  function showGround() {
    if (!ground) ground = groundBuild(fen(), onSquareSelect);
  }

  function onSquareSelect(target) {
    onFilterSelect(null,null,target);
    m.redraw();
  }

  function onFilterSelect(side, description, target) {
    diagram.clearDiagrams(features());
    ground.setShapes([]);
    ground.set({
      fen: fen(),
    });
    ground.setShapes(diagram.diagramForTarget(side, description, target, features()));
  }

  function showAll() {
    ground.setShapes(diagram.allDiagrams(features()));
  }

  function updateFen(value) {
    fen(value);
    ground.set({
      fen: fen(),
    });
    ground.setShapes([]);
    features(generate.extractFeatures(fen()));
    queryparam.updateUrlWithState(fen());
  }

  function nextFen(dest) {
    updateFen(fendata[Math.floor(Math.random() * fendata.length)]);
  }

  showGround();
  m.redraw();
  if (opts.showAll) {
    showAll();
  }

  return {
    fen: fen,
    ground: ground,
    features: features,
    updateFen: updateFen,
    onFilterSelect: onFilterSelect,
    onSquareSelect: onSquareSelect,
    nextFen: nextFen,
    showAll: showAll
  };
};
