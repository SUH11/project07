const { Service } = require('egg')
const nodemailer = require('nodemailer')
const path = require('path')
const fse = require('fs-extra')

class ToolService extends Service {

  async sendMail(email, subject, text, html) {
    const userEmail = 'project07@163.com'
    const transporter = nodemailer.createTransport({
      host: "smtp.163.com", // 163的服务器地址
      port: 465, // ssl的端口 163参考文档：https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac22dc0e9af8168582a
      secure: true,
      auth: {
        user: userEmail,
        pass: 'AHVUDYGPCROYWUZJ' // 这里是授权码
      }
    })
    const mailOptions = {
      from: userEmail,
      cc: userEmail, // 抄送
      to: email,
      subject,
      text,
      html
    }
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (e) {
      console.log('===============sendMailerror=================', e)
      return false
    }
  }

  async mergeFile(filePath, fileHash, size) {
    const chunksDir = path.resolve(this.config.UPLOAD_DIR, fileHash)
    let chunks = await fse.readdir(chunksDir)
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1])
    chunks = chunks.map(cp => path.resolve(chunksDir, cp))
    console.log('chunks===============', typeof chunks[0])
    await this.mergeChunks(chunks, filePath, size)
  }

  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })
    await Promise.all(
      files.map((file, index) => {
        console.log('file]]=================================', typeof file)
        pipStream(file, fse.createWriteStream(dest, {
          start: index * size,
          end: (index + 1) * size
        }))
      })
    )
  }


}

module.exports = ToolService