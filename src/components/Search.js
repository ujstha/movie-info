import React, { Component } from 'react';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import '@zendeskgarden/react-pagination/dist/styles.css';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import { Pagination } from '@zendeskgarden/react-pagination';

const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = 'ceb40971';

export default class Search extends Component {
    constructor() {
        super();
        this.state = {
            movieData: [],
            isLoaded: '',
            query: '',
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value === '') {
            this.setState({ movieData: [], isLoaded: '' })
        }
    };

    search = (e) => {
        e.preventDefault();
        axios.get(`${BASE_URL}?s=${this.state.query}&type=&apikey=${API_KEY}`)
        .then(res => {
            console.log(res.data, 'data');
            const movies = res.data;
            this.setState({ isLoaded: movies.Response /*return True or False*/, movieData: movies });
            console.log(this.state.movieData);
            console.log(this.state.isLoaded, 'loaded');
        })
        console.log(this.state.query);
    }

    searchResult = () => {
        if (this.state.isLoaded === "True") {
            return (
                <div>
                    <h1>Search Result for "{this.state.query}"</h1>
                    <div>
                        {this.state.movieData.Search.map((movie, i) => (
                            <div key={i}>
                                {movie.Title}
                                <img src={movie.Poster} style={{width: '200px', height: '185px'}} alt={movie.Title} />
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.search}>
                    <TextField
                        id="outlined-search"
                        name="query"
                        label="Search Movies, TV Shows...."
                        type="search"
                        fullWidth={true}
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                    />
                    
                </form>
                {this.state.isLoaded === "False" ? <h1>Movie Not Found!</h1> : ''}
                {this.searchResult()}
                {console.log(this.state.query)}
            </div>
        )
    }
};
