import React, { Component } from 'react';
import axios from 'axios';

export default class OmdbGet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieData: null,
            movieName: ''
        }
    }

/*

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    search = (e) => {
        e.preventDefault();
        axios.get(`http://www.omdbapi.com/?s=${this.state.movieName}&type=&apikey=ceb40971`)
        .then(res => {
            console.log(res.data, 'data');
            const movies = res.data;
            this.setState({ movieData: movies });
            console.log(this.state.movieData);
        })
        console.log(this.state.movieName);
    }
*/
    render() {
        return (
            /*
            <div>
                {this.state.movieData !== null ? this.state.movieData.Search.map((movie, i) => (
                    <div key={i}>
                        {movie.Title}
                    </div>
                )) : ''}
                <form onSubmit={this.search}>
                    <input type="text" name="movieName" placeholder="Search" onChange={this.onChange} />
                </form>
                {console.log(this.state.movieName)}
            </div>
            */
           <div>
               <h1>helo {this.props.payload}</h1>
               <button onClick={this}>{this.props.name}</button>
           </div>
        )
    }
};
