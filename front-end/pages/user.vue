<template>
  <div>
    <h1>用户中心</h1>
    <div ref="drag" id="drag">
      <input type="file" name="file" @change="handleFilerChange">
    </div>
    <div>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="uploadProgress"></el-progress>
      <h1>chunks hash</h1>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="hashProgress"></el-progress>
      <h1>chunks hashIdleProgress</h1>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="hashIdleProgress"></el-progress>
      <h1>chunks hashSampleProgress</h1>
      <el-progress :text-inside="true" :stroke-width="20" :percentage="hashSampleProgress"></el-progress>
    </div>
    <h1>网格</h1>
    <div class="cube-container">
      <div class="cube" v-for="chunk in chunks" :key="chunk.name">
        {{chunk}}
      </div>
    </div>
    <el-button @click="uploadFile">上传</el-button>
  </div>
</template>

<script>
import sparkMD5 from 'spark-md5'
const CHUNK_SIZE = 0.5 * 1024 * 1024
export default {
  data() {
    return {
      file: null,
      uploadProgress: 0,
      chunks: [],
      hash: '',
      hashProgress: 0,
      hashIdleProgress: 0,
      hashSampleProgress: 0
    }
  },
  mounted() {
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
    createFileChunk(file, size = CHUNK_SIZE) {
      const chunks = []
      let cur = 0
      while (cur < this.file.size) {
        chunks.push({
          index: cur,
          file: this.file.slice(cur, cur + size)
        })
        cur += size
      }
      return chunks
    },
    async calculateHashWorker() {
      return new Promise(resolve => {
        this.worker = new Worker('./hash.js')
        this.worker.postMessage({
          chunks: this.chunks
        })
        this.worker.onmessage = e => {
          const { progress, hash } = e.data
          this.hashProgress = Number(progress)
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    async calculateHasIdle() {
      const chunks = this.chunks
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        let count = 0
        const appedToSpark = async file => {
          const reader = new FileReader()
          reader.readAsArrayBuffer(file)
          reader.onload = e => {
            spark.append(e.target.result)
            // resolve()
          }
        }
        const workLoop = async deadline => {
          while (count < chunks.length && deadline.timeRemaining() > 1) {
            // 有任务 且有空闲时间
            await appedToSpark(chunks[count].file)
            count ++
            if (count < chunks.length) {
              this.hashIdleProgress = Number(((100 * count) / chunks.length).toFixed(2))
            } else {
              this.hashIdleProgress = 100
              resolve(spark.end())
            }
          }
          window.requestIdleCallback(workLoop)
        }
        window.requestIdleCallback(workLoop)
      })
    },
    async calculateHasSample() {
      return new Promise(resolve => {
        const spark = new sparkMD5.ArrayBuffer()
        const reader = new FileReader()

        const file = this.file
        const size = file.size
        const offset = 2 * 1024 * 1024
        let chunks = [file.slice(0, offset)]
        let curr = offset

        while (curr < size) {
          if (curr += offset >= size) {
            chunks.push(file.slice(curr, curr + offset))
          } else {
            const mid = curr + offset / 2
            const end = curr + offset
            chunks.push(file.slice(curr, curr + 2))
            chunks.push(file.slice(mid, mid + 2))
            chunks.push(file.slice(end - 2, end))
          }
          curr += offset
        }

        reader.readAsArrayBuffer(new Blob(chunks))
        reader.onload = e => {
          spark.append(e.target.result)
          this.hashSampleProgress = 100
          resolve(spark.end())
        }
      })
    },
    async uploadFile() {
      // let validate = await this.isImage(this.file)
      // if (!validate) {
      //   console.log('文件格式不正确')
      // } else {
      //   console.log('格式正确')
      // }

      const chunks = this.createFileChunk(this.file)
      // this.chunks = chunks
      // console.log('chunks', this.chunks)
      // const hash1 = await this.calculateHashWorker()
      // const hash2 = await this.calculateHasIdle()
      const hash = await this.calculateHasSample()
      // console.log('hash1', hash1)
      // console.log('hash2', hash2)
      // console.log('hash3', hash3)
      // return
      this.hash = hash

      this.chunks = chunks.map((chunk, index) => {
        const name = hash + '-' + index
        return {
          name,
          hash,
          index,
          chunk: chunk.file,
          progress: 0
        }
      })
      
      await this.uploadChunks()

      // const form = new FormData()
      // form.append('name', 'file')
      // form.append('file', this.file)

      // const res = await this.$http.post('/uploadfile', form, {
      //   onUploadProgress: progress => {
      //     this.uploadProgress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
      //   }
      // })
    },
    async uploadChunks() {
      const requests = this.chunks.map(({chunk, hash, name}, index) => {
        const form = new FormData()
        form.append('chunk', chunk)
        form.append('hash', hash)
        form.append('name', name)
        return form
      }).map((form, index) => this.$http.post('/uploadfile', form, {
        onUploadProgress: progress => {
          this.chunks[index].progress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
        }
      }))
      await Promise.all(requests)
      await this.mergefile()
    },
    async mergefile() {
      this.$http.post('/mergefile', {
        ext: this.file.name.split('.').pop(),
        size: CHUNK_SIZE,
        hash: this.hash
      })
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
      return await this.isPng(file)
    },
    // @todo 二进制里有宽高的信息
    async isGif(file) {
      // GIF89a GIF87a
      // 6个16进制 '47 49 46 38 39 61'  '47 49 46 38 37 61'
      const res = await this.blobToString(file.slice(0, 6))
      return res === '47 49 46 38 39 61' || res === '47 49 46 38 37 61'
    },
    async isPng(file) {
      const res = await this.blobToString(file.slice(0, 6))
      console.log('res', res)
      return res === '89 50 4E 47 0D 0A'
    },
    async isJpg(file) {
      const len = file.size
      const start = await this.blobToString(file.slice(0, 2))
      const tail = await this.blobToString(file.slice(-2, len))
      return (start === 'FF D8') && (tail === 'FF D9')
    },
    async blobToString(blob) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(blob)
        reader.onload = function() {
          const res = reader.result.split('')
                        .map(v => v.charCodeAt())
                        .map(v => v.toString(16).toUpperCase())
                        .map(v => v.length < 2 ? `0${v}` : v)
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