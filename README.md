# canvas-crop
canvas 图片 移动、缩放、裁剪
### 移动端使用canvas裁剪完成海报
![](https://images.pexels.com/photos/4050291/pexels-photo-4050291.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500)
> 在一开始看到这个需求的时候就比较开心，早就想玩玩这个东西了，直接上图

<br/>

![](https://bwgj-course.cn-bj.ufileos.com/test/homework/image/202008/07/5azGkfA4RrnVuFroNkGkQXbGOb4mBh0n.gif)






























































#### 需求描述
有多个模板，上传自己的照片，可以**放大缩小**、**移动**，（因为使用pc录制的，所以没有使用双指操作），点击生成海报后，生成二维码放在右下角




### 知识点
- 移动端事件（touchstart, touchmove）单指 和 双指操作

- 生成二维码（qrcode插件）

- 绘制canvas，移动，缩放，裁剪 生成最终效果



#### 本项目使用react，为了方便查看，demo使用原生js来写
为了方便大家，这里是demo地址，亲测，完全可以使用，希望老铁能给个star
[canvas 生成海报](https://github.com/yuanhaoaaa/canvas-crop)




## 开始
这里，因为开源出去，我就不用上传图片，直接将图片写入canvas

#### 两张图片


```language
let canvas = document.querySelector('#canvas'),
            buttonImg = document.querySelector('#poster-button'),
            ctx = canvas.getContext('2d'),
            // 背景图片
            backgroundImagePath = 'https://cdn-ufile-course.beiwaiguoji.com/files/upload/posterImage/2020/08/05/7/8177dbbeaee043e49d7b379462117750.png',
            // 上传图片
            uploadImagePath = 'https://bwgj-course.cn-bj.ufileos.com/test/homework/image/202008/07/eU1kYL1w38YeVvaiG9wwdr4GXlsadPOS.jpeg',
            backgroundImage = '',
            uploadImage = '',
            // 屏幕宽高
            winWidth = window.innerWidth,
            winHeight = window.innerHeight;

       main()

            function main() {
                canvas.width = 614 * winWidth / 750,
                canvas.height = 830 * canvas.width / 614,

                this.initCanvasImage()
            }

            async function initCanvasImage() {
                uploadImage = await loadingImage(uploadImagePath)
                backgroundImage = await loadingImage(backgroundImagePath)
                
                // canvas的层级 最后画的层级高
             
        ctx.drawImage(uploadImage, 0, 0)
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
            }

             function loadingImage(path) {
                return new Promise((resolve, reject) => {
                    let img = new Image()
                    /**
                    *   坑1 使用crossOrigin 用来解决跨域问题，但是前提是图片响应头 必须有 Access-Control-Allow-Origin: * 字段
                    *   坑2 该属性 必须写在src之前，否则在ios会报安全问题
                    *   上面两个问题 都是在最后裁剪的问题  ctx.toDataURL()
                    */
                    img.crossOrigin = 'anonymous';
                    img.src = path
                    img.onload = () => {
                        resolve(img)
                    }
                })
            }
           

```


现在页面长这样
![](https://bwgj-course.cn-bj.ufileos.com/test/homework/image/202008/07/0XdFXGZ0XK628KJTrwovDIKLijla6jXC.png)

### 单指移动
```language
function main() {
     //...
     bindEvent()
}
/**
            *   绑定事件
            */
            function bindEvent() {
                

                canvas.addEventListener('touchstart', onTouchStart)
                canvas.addEventListener('touchmove', onTouchMove)

                function onTouchStart(e) {
                    let oneFinger = e.touches[0]
                }

                function onTouchMove(e) {
                    let oneFinger = e.touches[0],
                        twoFinger = e.touches[1],
                        touches = e.touches.length
                        // 单指操作
                        if (touches === 1) {
                            handleOneFinger(oneFinger)
                        }
                    
                }

                function handleOneFinger(oneFinger) {
                    let {clientX, clientY} = oneFinger
                    // X轴移动
                    if (oneFingerClientX !== clientX) {
                        if (clientX > oneFingerClientX) {
                            // 向右
                            oneFingerMoveX += 3
                           
                        } else {
                            // 向左
                            oneFingerMoveX -= 3
                        }
                    }
                    // Y轴移动
                    if (oneFingerClientY !== clientY) {
                        if (clientY > oneFingerClientY) {
                            // 向右
                            oneFingerMoveY += 3
                            
                        } else {
                            // 向左
                            oneFingerMoveY -= 3
                        }
                    }
                    oneFingerClientX = clientX
                    oneFingerClientY = clientY
                    redrawImage()
                }
            }

/**
            *   重画图片
            */
            function redrawImage() {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(uploadImage, oneFingerMoveX, oneFingerMoveY)
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
            }
```
### 双指缩放

```language
 /**
                *   处理双指
                */
                function handleTwoFinger(e) {
                    let oneFinger = e.touches[0],
                        twoFinger = e.touches[1],
                        oneClientX = oneFinger.clientX,
                        twoClientX = twoFinger.clientX

                    if (oneClientX >= firstFingerMoveX && twoClientX <= secondFingerMoveX) {
                            // 向内
                            uploadImageWidth = oneFingerStartX < twoFingerStartX ? uploadImageWidth - 3 : uploadImageWidth + 3
                        } else {
                            // 向外
                            uploadImageWidth = oneFingerStartX < twoFingerStartX ? uploadImageWidth + 3 : uploadImageWidth - 3
                        }

                    

                    firstFingerMoveX = oneClientX
                    secondFingerMoveX = twoClientX
                    // 算出同等比例的高度
                    uploadImageHeight = uploadImageInitHeight * uploadImageWidth / uploadImageInitWidth
                    // 重画
                    redrawImage()
                }
```
### 二维码生成

在这里使用qrcode.js  大家有兴趣了自己百度下，我查了下文档，发现实例没有生成二维码的字段，我修改了下源码，可以在实例后存储二维码的base64图片，没办法，咱需要把他画到canvas里

这里最后的代码演示都会放到仓库中，不做过多的描述

