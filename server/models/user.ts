import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: string;
  inHotelId: string;
  name: string;
  password: string;
  hotels: [
    {
      id: string;
      name: string;
    }
  ];
  accessRights: [string];
  login: {
    lastLogin: string;
    token: string;
  };
}

const UserSchema = new mongoose.Schema({
  inHotelId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  hotels: [
    {
      id: {
        type: String,
        required: true,
        minlength: 1
      },
      name: {
        type: String,
        required: true,
        minlength: 1
      },
      _id: false
    }
  ],
  accessRights: {
    type: [String],
    required: true
  },
  login: {
    lastLogin: {
      type: Number
    },
    token: {
      type: String
    }
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
