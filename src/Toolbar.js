import React from "react";
import esriLoader from "esri-loader";

export default class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            drawing: false,
            activeGraphic: null,
            toolbar: null,
            editToolbar: null,
            initialized: false,
            Edit: null,
            Draw: null,
            Graphic: null,
            Color: null,
            Polygon: null,
            Polyline: null,
            Point: null,
            SimpleMarkerSymbol: null,
            SimpleLineSymbol: null,
            SimpleFillSymbol: null
        };
        this.handlePoint = this.handlePoint.bind(this);
        this.handleArrow = this.handleArrow.bind(this);
        this.handlePolygon = this.handlePolygon.bind(this);

        this.add = this.add.bind(this);
        this.flipLine = this.flipLine.bind(this);
        this.addNewLine = this.addNewLine.bind(this);
        this.remove = this.remove.bind(this);
    }

    add(evt) {
        let symbol, graphic;
        this.state.drawToolbar.deactivate();
        switch (evt.geometry.type) {
            case "point":
                // pick geolocaiton
                symbol = new this.state.SimpleMarkerSymbol();
                symbol.setColor(new this.state.Color([255,0,0,1]));
                // print locations
                console.log("Lat:" + evt.geometry.getLatitude());
                console.log("Lon:" + evt.geometry.getLongitude());
                break;
            case "polyline":
                symbol = new this.state.SimpleLineSymbol();
                // show arrow
                symbol.setMarker({style: "arrow", placement: "end"});
                symbol.setColor(new this.state.Color([255,0,0,1]));
                symbol.setWidth(5);
                break;
            default:
                // for polygon
                symbol = new this.state.SimpleFillSymbol();
                break;
        }
        graphic = new this.state.Graphic(evt.geometry, symbol);

        // TODO: save GeoJson info as attribute
        graphic.setAttributes({created: Date.now()});
        this.props.map.graphics.add(graphic);
        this.setState({drawing: false});
    }

    componentDidUpdate(prevProps) {
        if (this.props.map != null && this.state.initialized === false) {
            this.setState({initialized: true});
            // map is loaded
            const options = {
                url: 'https://js.arcgis.com/3.26/'
            };
            esriLoader.loadModules(
                ["esri/toolbars/draw", "esri/toolbars/edit", "esri/graphic", "esri/Color", "esri/geometry/Polyline",
                    "esri/geometry/Polygon", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol",
                    "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "dojo/_base/event"],
                options)
                .then(([Draw, Edit, Graphic, Color, Polyline, Polygon, Point,
                           SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, event]) => {
                    // save ArcGis class
                    this.setState({Draw, Edit, Graphic, Color, Polyline, Point,
                        SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol});

                    // create toolbars
                    const drawToolbar = new Draw(this.props.map);
                    const editToolbar = new Edit(this.props.map);

                    // set a callback after drawing
                    drawToolbar.on("draw-end", this.add);

                    // add a event listener to geo objects
                    const self = this;
                    this.props.map.graphics.on("click", function(evt) {
                        // do nothing during drawing
                        if (self.state.drawing) return;

                        self.setState({activeGraphic: evt.graphic});

                        event.stop(evt);

                        // specify drawToolbar options
                        const tool = Edit.MOVE | Edit.EDIT_VERTICES;
                        const options = {
                            allowAddVertices: true,
                            allowDeleteVertices: true,
                            uniformScaling: true,
                        };
                        // start editing
                        editToolbar.activate(tool, evt.graphic, options);
                    });


                    // end editing when you click outside a graphic
                    this.props.map.on("click", function(evt){
                        self.setState({activeGraphic: null});
                        editToolbar.deactivate();
                    });

                    this.setState({drawToolbar});
                    this.setState({editToolbar});
                })
                .catch(err => {
                    // handle any script or module loading errors
                    console.error(err);
                });
        }
    }

    handlePoint(event) {
        if (this.state.drawToolbar == null) {
            console.error("toolbar is not loaded");
        } else {
            this.setState({drawing: true});
            this.state.drawToolbar.activate(this.state.Draw.POINT);
        }
    }

    handleArrow(event) {
        if (this.state.drawToolbar == null) {
            console.error("toolbar is not loaded");
        } else {
            this.setState({drawing: true});
            this.state.drawToolbar.activate(this.state.Draw.POLYLINE);
        }
    }

    handlePolygon(event) {
        if (this.state.drawToolbar == null) {
            console.error("toolbar is not loaded");
        } else {
            this.setState({drawing: true});
            this.state.drawToolbar.activate(this.state.Draw.POLYGON);
        }
    }

    flipLine(event) {
        // this action only works for polyline
        if (this.state.activeGraphic != null
            && this.state.activeGraphic.geometry.type === "polyline") {
            // flip direction
            let reversePath = this.state.activeGraphic.geometry.removePath(0);
            reversePath.reverse();
            this.state.activeGraphic.geometry.addPath(reversePath);
            this.props.map.graphics.remove(this.state.activeGraphic);
            this.props.map.graphics.add(this.state.activeGraphic);
        }
    }

    addNewLine(event) {
        // this action only works for polyline
        if (this.state.activeGraphic != null
            && this.state.activeGraphic.geometry.type === "polyline") {
            // flip direction
            const len = this.state.activeGraphic.geometry.paths[0].length;
            let newPaths = [];
            for (let i=0; i<len; i++) {
                // use offset to slide a location
                newPaths[i] = this.state.activeGraphic.geometry.getPoint(0, i).offset(1000000, -1000000);
            }
            this.state.activeGraphic.geometry.addPath(newPaths);
            this.props.map.graphics.remove(this.state.activeGraphic);
            this.props.map.graphics.add(this.state.activeGraphic);
        }
    }

    remove(event) {
        // this action only works for polyline
        if (this.state.activeGraphic != null) {
            this.props.map.graphics.remove(this.state.activeGraphic);
        }
    }

    render() {
        return (
            <div id="toolbar">
                <span>Draw: </span>
                <button onClick={this.handlePoint}>Point</button>
                <span> </span>
                <button onClick={this.handleArrow}>Line</button>
                <span> </span>
                <button onClick={this.handlePolygon}>Polygon</button>
                <span> | Edit: </span>
                <button onClick={this.flipLine}>Flip Line</button>
                <span> </span>
                <button onClick={this.addNewLine}>Add Line</button>
                <span> </span>
                <button onClick={this.remove}>Remove</button>
            </div>
        );
    }
}
