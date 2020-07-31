<template>
  <div>
    <h1>用户中心</h1>
    <div ref="drag" id="drag">
      <input type="file" name="file" @change="handleFilerChange">
    </div>
    <div>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="uploadProgress"></el-progress>
    </div>
    <el-button @click="uploadFile">上传</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      uploadProgress: 0
    }
  },
  mounted() {
    // this.getUserInfo()
    this.bindEvents()
  },
  methods: {
    bindEvents() {
      const drag = this.$refs.drag

      drag.addEventListener('dragover', e => {
        drag.style.borderColor = 'blue'
        console.log(1)
        e.preventDefault()
      })

      drag.addEventListener('dragleave', e => {
        drag.style.borderColor = '#eee'
        console.log(2)
        e.preventDefault()
      })

      drag.addEventListener('drop', e => {
        console.log('e.dataTransfer', e.dataTransfer)
        const fileList = e.dataTransfer.files

        this.file = fileList[0]

        drag.style.borderColor = '#eee'
        e.preventDefault()
      })
    },
    async getUserInfo() {
      let res = await this.$http.get('/user/info')
      console.log('/user/info===', res)
    },
    async uploadFile() {
      console.log(111)
      let validate = await this.isImage(this.file)
      console.log(validate)
      if (!validate) {
        console.log('文件格式不正确')
      } else {
        console.log('格式正确')
      }
      const form = new FormData()
      form.append('name', 'file')
      form.append('file', this.file)

      const res = await this.$http.post('/uploadfile', form, {
        onUploadProgress: progress => {
          this.uploadProgress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
        }
      })
      console.log('upload res===========', res)
    },
    handleFilerChange(e) {
      const [file]= e.target.files
      // 限制文件格式 
      if (!file) return
      this.file = file
    },
    async isImage(file) {
      // 通过文件流来判定
      // gif
      return await this.isGif(file)
    },
    async isGif(file) {
      // GIF89a GIF87a
      // 6个16进制 '47 49 46 38 39 61'  '47 49 46 38 37 61'
      const res = await this.blobToString(file.slice(0, 6))

      console.log('res', res)
      
      return res === '47 49 46 38 39 61' || res === '47 49 46 38 37 61'
    },
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(blob)
        reader.onload = function() {
          const res = reader.result.split('')
                        .map(v => v.charCodeAt())
                        .map(v => v.toString(16).toUpperCase())
                        .join(' ')

          resolve(res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#drag {
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #eee;
}
</style>