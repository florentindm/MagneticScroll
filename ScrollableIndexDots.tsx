import * as React from "react";
import { PropertyControls, ControlType, Frame, Data, Animatable } from "framer";

// Define type of property
interface Props {
    scrollableList: string;
}

export class ScrollableIndexDots extends React.Component<Props> {

    // Set default properties
    static defaultProps = {
    }

    data = Data({
        position:Animatable(0)
    });
    count = this.props.count - 1;
    step = this.props.height/this.count
    position = 0;
    previousIndex = 0;

    // Items shown in property panel
    static propertyControls: PropertyControls = {
        scrollableList: { type: ControlType.String, title: "Scrollable List" }
    }

    onScroll(e){
        this.position = this.position + e.delta.y;
        this.setIndexMark(this.position/this.props.height)
    }

    onTapStart(e){
        this.position = e.point.y;
        this.setIndexMark(this.position/this.props.height)
    }

    setIndexMark(ratio){
        //Set scroll limits
        if(ratio < 0 || ratio > 1) return;
        var index = ratio*this.count;
        index = Math.round(index);

        //Set ball position
        if(index != this.previousIndex){
            this.data.position.set(index*this.step);
            this.props.onIndexChange(index);
        }

        this.previousIndex = index;
    }

    updateIndex(i){
        console.log(i, i*this.step)
        this.data.position.set(-i*this.step);
    }


    render() {
        return  <Frame
                    onTapStart={(e) => this.onTapStart(e)}
                    onPan={(e)=>this.onScroll(e)}
                    ref="lift"
                    width={this.props.width}
                    height={this.props.height}
                    background="none">

                    <Frame
                        ref="ball"
                        top={this.data.position}
                        background="#75AFFF"
                        width={6}
                        height={6}
                        radius="100%">
                    </Frame>

                </Frame>;
    }
}
