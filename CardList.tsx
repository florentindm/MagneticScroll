import * as React from "react";
import { PropertyControls, ControlType, Frame, Animatable } from "framer";
import {Scrollable} from "./Scrollable";
import {ScrollableIndexDots} from "./ScrollableIndexDots";

const listStyle: React.CSSProperties = {
    position:"absolute",
    top:0,
    left:0,
    backgroundColor:"blue",
    display: "flex",
    flexDirection: "column",
};

const cardStyle: React.CSSProperties = {
    boxSizing: "border-box",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    backgroundColor:"red",
};

interface Props {
    cardComponent: JSX.Element;
    dataPath: string;
    gutter: number;
    snapDuration: number;
    snapLimit: number;
    index: string;
    startPosition : string;
}

export class CardList extends React.Component<Props> {

    // Set default properties
    static defaultProps = {
        gutter: 200,
        snapDuration: 0.05,
        snapLimit: 0.01,
        startPosition: 'top',
        index:'dots'
    }

    state = {
        data:undefined
    };

    indexes = {
        "dots":ScrollableIndexDots,
        "none":Frame
    }

    // Items shown in property panel
    static propertyControls: PropertyControls = {
        cardComponent: { type: ControlType.ComponentInstance, title: "Card" },
        dataPath: { type: ControlType.String, title: "JSON" },
        gutter: { type: ControlType.Number, title: "Gutter", min:-1000, max:1000 },
        snapDuration: { type: ControlType.Number, title: "Snap Duration", min:0, max:1, step:0.1 },
        snapLimit: { type: ControlType.Number, title: "Snap Limit", min:0, max:1, step:0.1 },
        startPosition: { 
            type: ControlType.SegmentedEnum, 
            title: "Default position",
            options: ["top", "bottom"],
            optionTitles: ["Top", "Bottom"]
        },
        index: {
            type: ControlType.Enum,
            options: ["none", "dots"],
            optionTitles: ["None", "Dots"],
            title: "Index"
          },
    }

    getData(jsonPath, next) {
        fetch(jsonPath)
        .then(response => response.json())
        .then(function(data){
            console.log("getData", data);
            next(data);
        });
    }

    componentDidMount() {
        var self = this;
        this.getData(this.props.dataPath, function(results){
            //Set data
            self.setState({ data: results })
        });
    }

    updateIndex(i){
        this.refs.index.updateIndex(i)
    }

    render() {
        console.log('CardList - Card')
        console.log(this.props.cardComponent)
        console.log(this.props)
        if(this.state.data === undefined) return <div>Not ready</div>
        var cardComponent = this.props.cardComponent[0] || this.props.cardComponent;
        var dataSet = this.state.data;
        var self = this;
        if(this.props.index != 'none') var Index = this.indexes[this.props.index];
        return  <Frame {...this.props} background="none">
                    
                    <Scrollable
                        ref="scrollableZone"
                        width={this.props.width}
                        height={this.props.height}
                        gutter={this.props.gutter}
                        count={dataSet.length}
                        resistance={1.1}
                        snapDuration={this.props.snapDuration}
                        snapLimit={this.props.snapLimit}
                        onChange={(i)=>this.updateIndex(i)}>

                        <div>
                            {dataSet.map(function(item, i){
                                var Card = React.cloneElement(cardComponent, {
                                    ...item,
                                    top:i*(self.props.height + self.props.gutter),
                                    left:0,
                                    right:0,
                                    width:self.props.width,
                                    height:self.props.height,
                                    key:i
                                })
                                console.log('Mi Card');
                                console.log(Card);
                                return Card;
                            })}
                        </div>

                    </Scrollable>

                    <Frame
                        width={30}
                        height={this.props.height-60}
                        right={-30}
                        top={30}
                        background="none">

                        {
                            this.props.index != 'none' &&
                                <Index
                                    ref="index"
                                    count={dataSet.length}
                                    width={30}
                                    height={this.props.height-60}
                                    background="#ccc"
                                    onIndexChange={(i) => this.refs.scrollableZone.goToIndex(i)}>
                                </Index>
                            
                        }

                    </Frame>

                </Frame>
        return <div>Hey</div>
        
    }
}
