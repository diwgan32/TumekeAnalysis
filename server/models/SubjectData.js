const mongoose = require('mongoose');

const SubjectDataScheme = new mongoose.Schema({
  id: {
    type: Number,
    default: ''
  },
  Nose: {
    type: Array,
    default: []
  },
  Neck: {
    type: Array,
    default: []
  },
  RShoulder: {
    type: Array,
    default: []
  },
  RElbow: {
    type: Array,
    default: []
  },
  RWrist: {
    type: Array,
    default: []
  },
  LShoulder: {
    type: Array,
    default: []
  },
  LElbow: {
    type: Array,
    default: []
  },
  LWrist: {
    type: Array,
    default: []
  },
  MidHip: {
    type: Array,
    default: []
  },
  RHip: {
    type: Array,
    default: []
  },
  RKnee: {
    type: Array,
    default: []
  },
  RAnkle: {
    type: Array,
    default: []
  },
  LHip: {
    type: Array,
    default: []
  },
  LKnee: {
    type: Array,
    default: []
  },
  LAnkle: {
    type: Array,
    default: []
  },
  REye: {
    type: Array,
    default: []
  },
  LEye: {
    type: Array,
    default: []
  },
  REar: {
    type: Array,
    default: []
  },
  LEar: {
    type: Array,
    default: []
  },
  LBigToe: {
    type: Array,
    default: []
  },
  LSmallToe: {
    type: Array,
    default: []
  },
  LHeel: {
    type: Array,
    default: []
  },
  RBigToe: {
    type: Array,
    default: []
  },
  RSmallToe: {
    type: Array,
    default: []
  },
  RHeel: {
    type: Array,
    default: []
  },
  fileName: {
  	type: String,
  	default: ""
  },
  subjectID: {
    type: String,
    default: ""
  }
});
module.exports = mongoose.model('SubjectData', SubjectDataScheme);