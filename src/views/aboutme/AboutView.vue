<template>
  <div class="about-contaniner">
    <div class="main clearfix">
      <h2 class="clearfix" style="text-align: center;">
        关于我
      </h2>
      <div class="content">
        <img src="/public/avator/avator.webp" class="avator-about" align="left" width="300" height="300"
          style="margin-right: 15px; border-radius: 10%;">
        <p>
          大家好，我是黄祥坤，网名叫护城河？英文名是Jeff。关于我为什么叫这个姓名？答:前两个字是祖上给的，第三个字据说是我大伯从新华字典上找的。貌似拿这个最一后字也有点深意，能和五行能搭得上点边。但我一直不太喜欢这个姓名，因为这个三个字的HXK首字母，打出来总是好辛苦。每每如此我就总想，可能我的人生将也着很辛苦。
        </p>
        <p>
          至于网名叫护城河，源于看了一本书，一本挺庸俗的书。书中描绘了一座城，它说象征着晶莹剔透的爱情，但是漂浮在空中，
          而人只能站在地上的护城河旁，却也不懂得珍惜。这个网名起的很早，初中就是这个名字，到如今我也从来没有改过，对于这一点我一直挺骄傲的。
          而到现在，我觉得这名字也挺不错的，因为一定程度上它警醒着我，要在自己的人生路上去找到自己的护城河。
        </p>
        <p>
          英文名的来源也挺简单的，主要早年特别喜欢读些历史，特别喜欢变法的王安石。他字介甫。恰巧碰到要注册Google的邮箱就取了Jeff这个英文名，
          哦对，其实还有Smith这个英文的姓，这个姓就不知道为什么取了，可能是因为九年义务教育，它出现的频率高吧。
        </p>
        <p>
          关于我的过去，我大概率讲不出些什么。真要讲，我感觉很不幸运的生活在了后浪的时代，既没有赶上三次工业革命，也没有选对专业。“不幸运”成了一头没有站在“风口上的猪”，所以到现在也没有飞起来。真是命途多舛啊。但这么多年都活过来了，我想我要做的就是继续舔着脸，耐着性子好好活下去了。
        </p>
      </div>
      <details class="accordion">
        <summary class="accordion-toggle mobile-subtitle" @click="toggleAccordion">
          网络信息
        </summary>
        <div ref="accordionContent" class="accordion-content mobile-font-size">
          <ul>
            <li>QQ邮箱：<a href="mailto:2927678784@qq.com">2927678784@qq.com</a></li>
            <li>
              工作邮箱：<a v-tip="`注：1021这个是王安石出生的年份，别问我他是哪年死的，我不知道，但我记得他去世是阳历5月21日`"
                href="mailto:huchenghe1021@outlook.com">huchenghe1021@outlook.com</a>
            </li>
            <li>
              GitHub地址：<a href="https://github.com/huchenghepang" target="_blank">https://github.com/huchenghepang</a>
            </li>
            <li>座右铭：如果你相信你能得到什么，那么你将什么都得不到</li>
            <li>签名：贪梦好，茫然忘了邯郸道</li>
          </ul>
        </div>
      </details>
      <details>
        <summary class="mobile-subtitle">
          喜欢的事情
        </summary>
        <div class="details-content mobile-font-size">
          <p>以下是我喜欢的一些事情，这真的可以证明我生活在一个幸福的时代。</p>

          <ul>
            <li>喜欢这个世界虚伪的样子，它让我都感觉好像大有作为。</li>
            <li>喜欢那些处处为人着想的“制度"和“政策”,它让我都感觉未来可期。</li>
            <li>喜欢这个特殊的互联网，让我从来都不需要意识到我还需要自己主动去思考。</li>
            <!-- 这里以后可以做一个接口 统计赞同或者不赞同 -->
          </ul>
        </div>
      </details>
    </div>
    <div class="bottom">
      <div class=".bottom-content">
        <span class="title">「{{ CelebrityWord.title }}」</span>
        <span class="author">--{{ CelebrityWord.author }}--</span>
      </div>
      <div class="btn-bottom">
        <svg class="copt-btn" data-v-e6d63f7a="" width="21" height="21" viewBox="0 0 48 48" fill="none" @click="copy">
          <path data-v-e6d63f7a="" d="M20 6h18a2 2 0 012 2v22" stroke="#ffffff" stroke-width="4" />
          <path data-v-e6d63f7a=""
            d="M8 40V16a2 2 0 012-2h20c1.105 0 2 .892 2 1.997v24.011A1.99 1.99 0 0130.003 42H9.996A1.996 1.996 0 018 40z"
            stroke="#ffffff" stroke-width="4" />
        </svg>
        <svg class="refrech-btn" data-v-e6d63f7a="" width="48" height="48" viewBox="0 0 48 48" fill="none"
          @click="getWord">
          <path data-v-e6d63f7a=""
            d="M38.837 18C36.463 12.136 30.715 8 24 8 15.163 8 8 15.163 8 24s7.163 16 16 16c7.455 0 13.72-5.1 15.496-12"
            stroke="#ffffff" stroke-width="4" />
          <path data-v-e6d63f7a="" d="M40 8v10H30" stroke="#ffffff" stroke-width="4" />
        </svg>
      </div>
    </div>
  </div>
  <!-- 使用内嵌 SVG 花瓣 -->
  <FallingPetals :count="20" :speed="9" direction="down"
    svg-content="<svg viewBox=&quot;0 0 24 24&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><path d=&quot;M12 2C8 8 4 10 4 12c0 4 4 4 8 8s8-4 8-8c0-2-4-4-8-10z&quot;/></svg>" />
</template>

<script lang="ts" name=aboutme setup>
  import FallingPetals from "@/components/FallingPetals/FallingPetals.vue";

  import { ref } from "vue"
  /* 定义ref引用元素 */
  const accordionContent = ref<HTMLDivElement | null>(null);
  let toggleFrag = 0;
  function toggleAccordion(event: Event) {
    if (event.target) {
      (event.target as HTMLElement).classList.toggle('active');
    }
    /* 给内容添加样式 */
    if (accordionContent.value) {
      const content = accordionContent.value as HTMLElement;
      if (toggleFrag) {
        content.style.maxHeight = '0';
        toggleFrag = 0
      } else {
        toggleFrag = 1;
        content.style.maxHeight = content.scrollHeight + "px";
      }
    }
  }

  const CelebrityWord = ref({
    title: "每一个不曾起舞的日子，都是对生命的辜负。",
    author: "尼采"
  })

  const wordList = [
    {
      title: "每一个不曾起舞的日子，都是对生命的辜负。",
      author: "尼采",
    },
    {
      title: "生于忧患，死于安乐。",
      author: "孟子",
    },
    {
      title: "三人行，必有我师焉：择其善者而从之，其不善者而改之。",
      author: "孔子",
    },
    {
      title: "老骥伏枥，志在千里；烈士暮年，壮心不已。",
      author: "曹操",
    },
    {
      title: "鞠躬尽瘁，死而后已。",
      author: "诸葛亮",
    },
    {
      title: "生活在阴沟里，依然有仰望星空的权利。",
      author: "王尔德",
    },
    {
      title: "采得百花成蜜后，为谁辛苦为谁甜。",
      author: "罗隐",
    },
    {
      title: "先天下之忧而忧，后天下之乐而乐。",
      author: "范仲淹",
    },
    {
      title: "生当作人杰，死亦为鬼雄。",
      author: "李清照",
    },
    {
      title: "纸上得来终觉浅，绝知此事要躬行。",
      author: "陆游",
    },
    {
      title: "粉骨碎身浑不怕，要留清白在人间。",
      author: "于谦",
    },
    {
      title: "天下兴亡，匹夫有责。",
      author: "顾炎武",
    }
  ]

  async function getWord() {
    /* 随机读取wordList中的一个 */
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const randomWord = wordList[randomIndex];
    CelebrityWord.value = randomWord;

  }

  async function copy() {
    const text = CelebrityWord.value.title;
    const title = CelebrityWord.value.author;
    const textarea = document.createElement('textarea');
    textarea.value = text + '——' + title;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    ElMessage({
      message: '复制成功',
      type: 'success',
    })

  }



</script>

<style scoped lang="scss">

  /* scss定义变量 折叠之后的样式 */
  /* 背景色 */
  $accordion-title-background-style: #c8d0da;

  .about-contaniner {
    /* main部分垂直水平居中对齐 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #eceff1;
    padding: 10px 20vw;
    min-height: calc(100vh - $header-height);
    box-sizing: border-box;

    [data-theme=dark] & {
      background-color: #14100D;
    }

    /* 主体部分 */
    .main {
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      min-width: 40vw;
      max-width: 60vw;
      font-size: 24px;
      color: #455a64;
      transition: all 0.3s ease;
      padding: 10px 40px;
      user-select: none;

      [data-theme=dark] & {
        background-color: #14100D;
      }

      /* 关于我的标题 */
      h2 {
        width: 70%;
        font-weight: 700;
        color: #220716;
        margin: 0 auto 20px;
        font-weight: bold;
        border-bottom: 2px solid #d83131;
        @include filter_invert();
      }

      h3.sub-title {
        font-size: 20px;
        color: #455a64;
        margin: 0 auto 30px;
        font-weight: bold;
        padding: 10px;
        border-bottom: 2px solid #398edf;
        text-align: left;
        background-color: #f1f4f5;
        user-select: none;
      }

      .content {
        -webkit-user-select: none;
        /* 适用于Chrome、Safari、Opera */
        -moz-user-select: none;
        /* 适用于Firefox */
        -ms-user-select: none;
        /* 适用于IE */
        user-select: none;

        p {
          
          /* 确保文字左对齐 */
          margin: 0;
          padding: 0;
          text-align: left;
          text-indent: 2em;
          /* 首行缩进 2 个字符（通常相当于 2 个空格） */
          margin-bottom: 5px;
        }

        /* 标准语法 */
      }
    }
  }





  /* 折叠效果 */
  details {
    padding: 0;
    margin: 0;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    @include filter_invert();
    .details-content {
      transition: max-height 0.5s ease;
      text-align: left;
      padding: 10px;

      li {
        /* li元素方格前缀 */
        flex-direction: column;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        list-style-type: "\1F44D";
      }
    }
  }

  summary {
    cursor: pointer;
    font-weight: bold;
    background-color: #f1f4f5;
    display: flex;
    justify-content: flex-start;
    border-bottom: 2px solid #455a64;
    

  }

  details[open] summary::after {
    content: "⬆️";
  }

  details[open] summary {
    background: $accordion-title-background-style;
  }

  summary::after {
    content: "➡️";
    float: right;
  }


  .accordion {
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .accordion-toggle {
    cursor: pointer;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    width: 100%;
    justify-content: flex-start;
    border: none;
    border-bottom: 2px solid #455a64;
  }

  .accordion-toggle::after {
    content: "➡️";
    float: right;
  }

  .accordion-content {
    overflow: hidden;
    max-height: 0;
    background: #f1f1f1;
    transition: all 0.6s ease-in-out;
  }

  .accordion-toggle.active {
    padding: 10px 0;
    background: $accordion-title-background-style;
  }

  .accordion-toggle.active::after {
    content: "⬆️";
  }


  .bottom {
    padding: 0;
    background-color: #c8d0da;
    /* 文字垂直居中 */
    height: 30px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    @include filter_invert();
    .bottom-content {
      display: flex;
      justify-items: center;
      align-items: center;
    }

    .btn-bottom {
      right: 20px;
      position: absolute;
    }

    .copt-btn,
    .refrech-btn {
      height: 20px;
      line-height: 20px;
      margin-left: 5px;
      top: 4px;
      cursor: pointer;

      &:hover {
        fill: #455a64;
      }
    }
  }


  @media screen and (max-width:768px) {
    .about-contaniner {
      display: block;
      width: 100vw !important;
      padding: 0 0;
      height: 100%;

      .main {
        width: 100% !important;
        padding: 0 5px !important;
        margin: 0 !important;
        max-width: none;

        h2 {
          font-size: 18px;
        }

        .avator-about {
          width: 100px;
          height: 100px;
        }

        p {
          font-size: 12px;
        }

        .mobile-subtitle {
          font-size: 16px;
        }

        .mobile-font-size {
          li {
            font-size: 12px;
          }

        }

      }
    }

    .bottom {
      flex-direction: column;
      font-size: 0.8rem;

      .btn-bottom {
        position: static;

        .copt-btn,
        .refrech-btn {
          top: 0;
        }


      }
    }
  }
</style>