import React, { Component } from 'react';
import axios from 'axios';
import { TextField, InputAdornment, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
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
            type: '',
            pageLimit: 5,
            paging: 1,
        }
    }
    componentDidMount() {
        const currentPage = Number(this.props.match.params.currentPage) || 1;
        const query = new URLSearchParams(this.props.location.search);
        const searchParam = query.get('s');
        this.setState({ query: searchParam });
        
        if(searchParam === "" || this.props.location.search === "") {
            return (
                this.props.history.push(``)
            )
        } else {
            axios.get(`${BASE_URL}?s=${searchParam}&page=${currentPage}&type=&apikey=${API_KEY}`)
            .then(res => {
                this.props.history.push(`/page/${currentPage}?s=${this.state.query}`);
                
                console.log(res.data, 'data');
                const movies = res.data;
                this.setState({ isLoaded: movies.Response /*return True or False*/, movieData: movies, paging: currentPage });
            })
        }
    }
    
    UNSAFE_componentWillUpdate() {
        window.scrollTo(0,0);
    }

    open = () => {
        this.setState({displayToggle: true})
    }

    close = () => {
        this.setState({displayToggle: false})
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
        const currentPage = Number(e.target.id) || Number(this.props.match.params.currentPage) || 1;

        this.props.history.push(`?s=${this.state.query}`);
        this.setState({displayToggle: false});

        axios.get(`${BASE_URL}?s=${this.state.query}&page=${currentPage}&type=&apikey=${API_KEY}`)
        .then(res => {
            this.props.history.push(`/page/${currentPage}?s=${this.state.query}`);
            
            console.log(res.data, 'data');
            const movies = res.data;
            this.setState({ isLoaded: movies.Response /*return True or False*/, movieData: movies, paging: currentPage });
            console.log(this.state.paging, 'pgai')
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
                    <Link to={`/page/${this.state.paging}`} key={number} style={number > 5 ? {display: 'none'} : {}} className={classes}>
                        <li 
                            id={number}
                            onClick={this.search}
                            className={classes}
                        >
                            {number}
                        </li>
                        {this.state.paging >= 4 ? <div id={this.state.paging+1}>next</div> : ''}
                    </Link>
                );
            });
            return (
                <div>
                    <div className="text-center my-4">
                        <h1>Search Result for "{this.state.query}"</h1>
                    </div>
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
                                    {renderPageNumbers.length > 5 ?
                                        <Link to={`/page/${renderPageNumbers.length}`} key={renderPageNumbers.length}>
                                            <li 
                                                id={renderPageNumbers.length}
                                                onClick={this.search}
                                            >
                                                {renderPageNumbers.length}
                                            </li>
                                        </Link> : ''
                                    }
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
            <div className="row">
                <div id="adv-search" style={this.state.displayToggle ? {display: 'block'} : {display: 'none'}} className="overlay">
                    <span className="closebtn" onClick={this.close} title="Close Overlay">×</span>
                    <div className="overlay-content">
                        <form onSubmit={this.search}>
                            <input 
                                type="text" 
                                name="query"
                                placeholder="Search Movies, TV Shows...." 
                                onChange={this.onChange}
                                value={this.state.query !== '' ? this.state.query : ''}
                            />
                            <button type="submit"><i class="fa fa-search"></i></button>                            
                        </form>
                    </div>
                </div>

                <form className="search-form col-md-12" onSubmit={this.search}>
                    <TextField
                        id="outlined-search"
                        name="query"
                        label="Search Movies, TV Shows......"
                        type="search"
                        fullWidth={true}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            style: {
                                fontFamily: "Raleway"
                            }
                        }}
                        InputProps={{
                            style: {
                                fontFamily: "Raleway"
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button margin="normal" onClick={this.search} variant="contained" size="large" color="primary">
                                        <SearchIcon fontSize="normal" />
                                    </Button>
                                </InputAdornment>
                              )
                        }}
                        onChange={this.onChange}
                        value={this.state.query !== '' ? this.state.query : ''}
                    />
                </form>
                <div className="col-md-12">
                    <Button className="openBtn" variant="contained" size="medium" color="secondary" onClick={this.open}>Advanced Search</Button>
                </div>
                <div className="col-md-12 text-center">
                    {this.state.isLoaded === "False" ? <h1>Movie Not Found!</h1> : ''}
                </div>
                <div className="col-md-12">
                {this.searchResult()}
                </div>
            </div>
        )
    }
};
