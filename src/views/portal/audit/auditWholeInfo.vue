<template>
  <div>
    <div class="banner">
      <img class="banner-images" src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1958191709,1897266013&fm=27&gp=0.jpg"/>
      <h2 class="banner-title">
        {{blockName}}
      </h2>
    </div>
    <h2 style="text-align: center;border-bottom:solid black 1px;margin: 40px;">{{ArticleTitle}}</h2>
    <h5 style="text-align: center">yyyy-MM-dd HH:mm:ss</h5>
    <h6 style="text-align: center">来源：<a :href="ArticleFrom">{{ArticleFrom}}</a ></h6>
    <div v-html="ArticleContent" style="margin-left: 15%;margin-right: 15%;"></div>
  </div>
</template>

<script>
  import{fetchAuditPreviewByContentId} from "@/api/portal"
  export default {
    name: 'ContentText',
    data () {
      return {
        blockName:'',
        image:'',
        ArticleTitle: '',
        ArticleFrom: '',
        ArticleContent: '',
      }
    },
    methods: {
      getArticle () {
        var self = this
        fetchAuditPreviewByContentId(this.$route.query.id).then(function (response) {
          console.log(response)
          self.blockName=response.data.blockName
          self.ArticleTitle=response.data.contentTitle
          self.ArticleFrom=response.data.contentFrom
          self.ArticleContent=response.data.contentContent
          self.image=response.data.image
        })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    mounted () {
      this.getArticle()
    }
  }
</script>

<style scoped>
  .banner {
    width: 100%;
    height: 350px;
    position: relative;
    overflow: hidden;
  }

  .banner-images {
    position: absolute;
    top: 0;
    left: 50%;
    display: block;
    width: 1920px;
    height: 100%;
    transform: translateX(-50%);
    z-index: 10;
  }
  .banner-title {
    font-weight: 400;
    font-size: 50px;
    line-height: 70px;
    position: absolute;
    top: 112px;
    z-index: 15;
    width: 100%;
    box-sizing: border-box;
    padding-left: 40px;
    color: #fff;
    pointer-events: none;
  }
</style>
