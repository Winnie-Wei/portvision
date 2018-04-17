/**
 * module mod/jobMarkBox/jobMarkBox 作业箱子展示
 */
define(function (require) {
    'use strict'
    var Group = require('zrender/container/Group');
    var ImageShape = require('zrender/graphic/Image');
    var RectShape = require('zrender/graphic/shape/Rect');
    var Text = require('zrender/graphic/Text');
    var BaseIamgeUrl = '../../src/js/mod/jobMarkBox/images/';
    var ImageUrl = BaseIamgeUrl + 'whiteSlash.png';
    var SpecalTypeImgUrl = BaseIamgeUrl + 'icon-danger-white.png';

    var JOBMARKBOX = function (cfg) {
        // 作业状态箱子
        this.zlevel = cfg.zlevel;
        this.rotation = cfg.rotation || 0;
        this.scale = cfg.scale || 1;
        this.width = cfg.width || 6;
        this.height = cfg.height || 3;
        this.position = cfg.position || [-this.width / 2, -this.height * 3];
        this.emptyWeightStatus = cfg.emptyWeightStatus || 'weight';
        this.inOutStatus = cfg.inOutStatus || 'in';
        this.boxColor = this.emptyWeightStatus === 'empty' ? '#FFF' : '#6D6D6D';
        this.boxType = cfg.boxType || [];
        this.yardOrCar = cfg.yardOrCar || 'yard';
        this.boxNumText = cfg.boxNumText || '';

        var boxGroup = new Group({
            position: this.yardOrCar === 'car' ? [this.position[0] / 2, this.position[1] / 2] :
                [this.position[0] - this.width / 2, this.position[1] - this.height / 2],
            scale: [this.scale, this.scale],
            width: this.width,
            height: this.height,
            rotation: this.rotation
        });

        var boxRect = new RectShape({
            style: {
                fill: this.boxColor
            },
            shape: {
                width: this.width,
                height: this.height
            },
            zlevel: this.zlevel + 1
        });

        if (this.emptyWeightStatus === 'empty') {
            ImageUrl = BaseIamgeUrl + 'graySlash.png';
        } else {
            ImageUrl = BaseIamgeUrl + 'whiteSlash.png';
        }
        var inOutImg = new ImageShape({
            style: {
                image: ImageUrl,
                width: this.width,
                height: this.height
            },
            zlevel: this.zlevel + 1
        });

        var specialIconGroup = new Group({
            position: [0, 0]
        })
        if (this.boxType) {
            for (var i = 0; i < this.boxType.length; i++) {
                var imgW, imgH, position;
                switch (i) {
                    case 0:
                        imgW = imgH = this.height * 0.8;
                        position = [this.height * 0.1, this.height * 0.1];
                        break;
                    case 1:
                        imgW = imgH = this.height * 0.4;
                        position = [this.height * 0.9, this.height * 0.1];
                        break;
                    case 2:
                        imgW = imgH = this.height * 0.4;
                        position = [this.height * 0.9, this.height * 0.5];
                        break;
                }
                var specialTypeImg = new ImageShape({
                    position: position,
                    style: {
                        image: '../../src/js/mod/popup/images/BOX/icon-' + this.boxType[i] + '.png',
                        width: imgW,
                        height: imgH
                    },
                    zlevel: this.zlevel + 1
                })
                specialIconGroup.add(specialTypeImg);
            }    
        }
        // 组建箱子的URL
        if (this.emptyWeightStatus === 'empty') {
            switch (this.boxType) {
                case 'danger':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-danger-gray.png';
                    break;
                case 'frozen':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-frozen-gray.png';
                    break;
                case 'overweight':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-overweight-gray.png';
                    break;
            }
        } else {
            switch (this.boxType) {
                case 'danger':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-danger-white.png';
                    break;
                case 'frozen':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-frozen-white.png';
                    break;
                case 'overweight':
                    SpecalTypeImgUrl = BaseIamgeUrl + 'icon-overweight-white.png';
                    break;
            }
        }
        // var specialTypeImg = new ImageShape({
        //     position: [this.height * 0.1, this.height * 0.1],
        //     style: {
        //         image: SpecalTypeImgUrl,
        //         width: this.height * 0.8,
        //         height: this.height * 0.8
        //     },
        //     zlevel: this.zlevel + 1
        // })

        var numText = new Text({
            scale: [1 / this.scale, 1 / this.scale],
            position: [this.width + 2, this.height],
            style: {
                text: this.boxNumText,
                textAlign: 'center',
                x: 0,
                y: 0,
                textFont: '8px Arial'
            },
            zlevel: this.zlevel
        })

        boxGroup.add(boxRect);
        // SpecalTypeImgUrl !== BaseIamgeUrl && boxGroup.add(specialTypeImg);
        this.boxType && boxGroup.add(specialIconGroup);
        (this.inOutStatus === 'in' && this.yardOrCar === 'yard') && boxGroup.add(inOutImg);
        this.boxNumText.length > 0 && boxGroup.add(numText);
        return boxGroup;
    };

    return JOBMARKBOX;
});