import React, { Component } from 'react';

export default class SingleMovie extends Component {
    render() {
        return (
            <div style={{backgroundColor: 'red'}}>
                <div className="row">
                    <div className="col-md-3">
                        Actors - 
                        {this.props.actor}
                    </div>
                    <div className="col-md-3">
                        Rating - 
                        {this.props.rating}
                    </div>
                </div>
            </div>
        )
    }
}