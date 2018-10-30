import React from "react";
import Toolbar from "./Toolbar";
import EsriLoaderReact from 'esri-loader-react';

export default class  ArcGisMap extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { map: null};
    }

    render() {
        const options = {
            // Use ArcGIS 3.x API because 4.x API misses editing features
            url: 'https://js.arcgis.com/3.26/'
        };

        return (
            <div>
                <Toolbar map={this.state.map}/>
                <div id ="map-designer"></div>
                <EsriLoaderReact
                    options={options}
                    modulesToLoad={['esri/map']}
                    className="map-container"
                    onReady={({loadedModules: [Map] }) => {
                        const map = new Map("map-designer", {
                            basemap: "streets",
                            center: [-15.469, 36.428],
                            zoom: 3
                        });
                        this.setState({map});
                    }}
                />
            </div>
        );
    }
}
