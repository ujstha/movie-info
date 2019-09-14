import React, { Component } from 'react';
import axios from 'axios';
import { TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = 'ceb40971';

export default class Search extends Component {
    constructor() {
        super();
        this.state = {
            movieData: [],
            isLoaded: '',
            query: '',
            pageLimit: 5,
            paging: null,
        }
    }
    componentDidMount(e) {
        const currentPage = Number(this.props.match.params.currentPage) || Number(e.target.id);
        const query = new URLSearchParams(this.props.location.search);
        const searchParam = query.get('s');
        this.setState({ query: searchParam });
        if(searchParam === "") {
            return (
                this.props.history.push(``)
            )
        } else {
            axios.get(`${BASE_URL}?s=${searchParam}&page=${currentPage}&type=&apikey=${API_KEY}`)
            .then(res => {
                if(currentPage === 1) {
                    this.props.history.push(`?s=${this.state.query}`);
                } else if (currentPage > 1) {
                    this.props.history.push(`/page/${currentPage}?s=${this.state.query}`);
                }
                console.log(res.data, 'data');
                const movies = res.data;
                this.setState({ isLoaded: movies.Response /*return True or False*/, movieData: movies, paging: currentPage });
                console.log(this.state.paging, 'pgai')
            })
        }
    }
    
    UNSAFE_componentWillUpdate() {
        window.scrollTo(0,0);
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value === '') {
            this.setState({ movieData: [], isLoaded: '' });
            this.props.history.push(``);
        }
    };

    search = (e) => {
        e.preventDefault();
        const currentPage = Number(e.target.id) || 1;
        this.props.history.push(`?s=${this.state.query}`);
        
        axios.get(`${BASE_URL}?s=${this.state.query}&page=${currentPage}&type=&apikey=${API_KEY}`)
        .then(res => {
            if(currentPage === 1) {
                this.props.history.push(`?s=${this.state.query}`);
            } else if (currentPage > 1) {
                this.props.history.push(`/page/${currentPage}?s=${this.state.query}`);
            }
            console.log(res.data, 'data');
            const movies = res.data;
            this.setState({ isLoaded: movies.Response /*return True or False*/, movieData: movies, paging: currentPage });
        })
    }

    searchResult = () => {
        const pageNumbers = [];
        if (this.state.isLoaded === "True") {
            for (let i = 1; i <= Math.ceil(Number(this.state.movieData.totalResults) / 10); i++) {
                pageNumbers.push(i);
            }
            const renderPageNumbers = pageNumbers.map(number => {
                let classes = this.state.paging === number ? 'active' : '';
                return (
                    <Link to={`/page/${number}`} key={number} className={classes}>
                        <li 
                            id={number}
                            onClick={this.search}
                            className={classes}
                        >
                            {number}
                        </li>
                    </Link>
                );
            });
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
                    {(renderPageNumbers.length <= 1) ? '' : 
                        <div className="row page-number">
                            <div className="col-md-12 text-center">
                                Page {this.state.paging} of {renderPageNumbers.length}
                            </div>
                            <div className="col-md-12">
                                <ul id="horizontal-list" className="text-center">
                                    {renderPageNumbers}     
                                </ul>
                            </div>
                            <br />
                        </div>
                    }
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
            </div>
        )
    }
};
