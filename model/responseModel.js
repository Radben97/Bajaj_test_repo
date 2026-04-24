const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reponseSchema = new Schema({
    user_id: {
    type: String,
    required: true
  },

  email_id: {
    type: String,
    required: true
  },

  college_roll_number: {
    type: String,
    required: true
  },

  hierarchies: {
    type: [hierarchySchema],
    required: true
  },

  invalid_entries: {
    type: [String],
    default: []
  },

  duplicate_edges: {
    type: [String],
    default: []
  },

  summary: {
    total_trees: {
      type: Number,
      required: true
    },
    total_cycles: {
      type: Number,
      required: true
    },
    largest_tree_root: {
      type: String,
      required: true
    }
  }
})

const hierarchySchema = new Schema({
  root: {
    type: String,
    required: true
  },

  tree: {
    type: Schema.Types.Mixed, // dynamic nested object
    required: true
  },

  depth: {
    type: Number,
    required: false
  },

  has_cycle: {
    type: Boolean,
    required: false
  }
}
)

module.exports = mongoose.model("Response",responseSchema)