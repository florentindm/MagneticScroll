import * as React from "react";
import { Frame, Animatable, animate } from "framer";

interface Props {
    onRender: any;
}

export class Scrollable extends React.Component<Props> {

    constructor(userOptions: object){
        super(userOptions);
        this.options = Object.assign(this.options, userOptions);
        this.step = this.options.height + this.options.gutter;
        this.snapBound = this.options.snapLimit;
        this.extremaResistance = this.options.extremaResistance;
        this.baseResistance = this.options.resistance;
        this.orientation = this.options.orientation;
        this.snapDuration = this.options.snapDuration;
        console.log(this.options)
    }

    options = {
        height:200,
        width:200,
        margin:40,
        snapLimit:0.02,
        count:3,
        step:0,
        gutter:0,
        extremaResistance:15,
        resistance:1,
        orientation:'y',
        snapDuration:0.1
    };

    animatableValue= Animatable(0);
    scrollPosition = Animatable(0);
    amount: number;
    step: number;
    position: number;
    approach: number;
    index = 0;
    direction: number;
    delta: number;
    snapping: boolean;
    snapBound: number;
    cursorPosition: string;
    extremaResistance: number;
    baseResistance = 1;
    resistance = 1;
    orientation: string;
    snapDuration: number;

    //PanEndCurve
    duration = 0.5;
    bezierCurve = [0,.99,.53,1] as Curve;
    bezierOptions = {curve: this.bezierCurve, duration:this.duration};

    onPan(e){
        this.delta = e.delta[this.orientation];
        this.direction = Math.sign(this.delta)
        this.amount = this.animatableValue.value + (this.delta/this.resistance)
        this.position = this.amount/this.step
        this.approach = this.position - Math.floor(this.position)
        this.animatableValue.set(this.amount);
        // console.log(this.step, this.snapBound);
        // return;
        //Scroll is at the top of the list
        if(this.position >= 0){
            // console.log('Top')
            this.cursorPosition = "top";
            this.animatableValue.set(this.amount);
            this.resistance = this.extremaResistance
        }
        //Scroll is at the bottom of the list
        else if(this.position < -this.options.count+1){
            // console.log('Bottom')
            this.cursorPosition = "bottom";
            this.animatableValue.set(this.amount);
            this.resistance = this.extremaResistance
        }
        //Scroll is in the middle of the list
        else{
            // console.log('Middle')
            this.cursorPosition = "middle";
            this.resistance = this.baseResistance

            //Scroll is before the snap boundary
            if(this.approach > 0 && this.approach < this.snapBound){
                this.snapping = false
                this.animatableValue.set(this.amount);
            }
            //Scroll has reached snap boundary
            else if(!this.snapping && this.approach >= this.snapBound && this.approach <= (1 - this.snapBound)){
                this.snapping = true
                if(this.direction === 1){
                    this.index = Math.ceil(this.position)
                }else{
                    this.index = Math.floor(this.position)
                }
                this.amount = this.index*this.step
                // console.log('Snapping')
                animate.bezier(this.animatableValue, this.amount, {curve:this.bezierCurve, duration:this.snapDuration});
                this.props.onChange(this.index);
            }
            //Scroll is after the snap boundary
            else if(this.approach > (1 - this.snapBound) && this.approach < 1){
                this.snapping = false;
                this.animatableValue.set(this.amount);
            }
        }
    }

    onPanEnd(e){
        if(this.cursorPosition == "top"){
            this.index = 0;
        }else if(this.cursorPosition == "bottom"){
            this.index = -this.options.count+1;
        }else if(this.cursorPosition == "middle"){
            this.index = Math.round(this.position)
        }
        this.amount = this.index*this.step
        animate.bezier(this.animatableValue, this.amount, this.bezierOptions);
    }

    public goToIndex(index){
        console.log("goToIndex", index, index*this.step)
        this.animatableValue.set(-index*this.step);
    }

    public goToLast(){
        this.animatableValue.set(-this.options.count*this.step);
    }

    render() {
        if(this.props.onRender) this.props.onRender();
        return  <Frame background="none" onPan={(e)=>this.onPan(e)} onPanEnd={(e)=>this.onPanEnd(e)} height={this.props.height} width={this.props.width}>
                    <Frame background="none" top={this.animatableValue} height={this.props.height} width={this.props.width} ref="scroll">{this.props.children}</Frame>
                </Frame>;
    }
}