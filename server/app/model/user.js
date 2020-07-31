// 建立用户模型
module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserSchema = new Schema({
    _v: { type: Number, select: false },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    nickname: { type: String, required: true },
    avatar: { type: String, required: false, default: '/user.png' }
  }, {
    timestamps: true // createAt updateAt
  })

  return mongoose.model('User', UserSchema)
}