import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, InputAdornment, Button, Collapse, Card, CardContent, Typography, FormControl, Select, MenuItem } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SingleMovie from '../SingleMovie/SingleMovie';

const BASE_URL = 'http://www.omdbapi.com/';
const API_KEY = 'ceb40971';

export default class Search extends Component {
    constructor() {
        super();
        this.state = {
            movieData: [],
            singleMovieData: [],
            isLoaded: '',
            query: '',
            type: '',
            pageLimit: 5,
            paging: 1,
            imdbID: []
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

    handleExpandOpen = () => {
        this.setState({displayToggle: !this.state.displayToggle})
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

        axios.get(`${BASE_URL}?s=${this.state.query}&page=${currentPage}&type=${this.state.type}&apikey=${API_KEY}`)
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
                    <Link to={`/page/${number}`} key={number} style={number > 5 ? {display: 'none'} : {}} className={classes}>
                        <li 
                            id={number}
                            onClick={this.search}
                            className={classes}
                        >
                            {this.state.paging+1 >=5 ? number+2 : number}
                        </li>
                        {number >= 5 && number < pageNumbers.length ? <li id={this.state.paging+1} onClick={this.search} style={this.state.paging === pageNumbers.length ? {display: 'none'} : {}}><i className="material-icons">next_page</i></li> : ''}
                    </Link>
                );
            });
            const { singleMovieData } = this.state;
            return (
                <div>
                    <div className="text-center my-4">
                        <h4><span className="text-primary">{this.state.movieData.totalResults}</span> search results for "{this.state.query}"</h4>
                    </div>
                    <div>
                        {this.state.movieData.Search.map((movie, i) => (
                            <div key={i}>
                                <div className="row" style={{padding: 30, paddingTop: 10, backgroundColor: 'rgba(0,0,0,.9)', color: 'white'}}>
                                    <div className="col-md-3">
                                        <img src={movie.Poster} style={{width: 170, height: 250, marginTop: 15}} alt={movie.Title} />
                                    </div>
                                    <div className="col-md-9 my-3">
                                        <h4 
                                            onClick={() => (axios.get(`${BASE_URL}?i=${movie.imdbID}&apikey=${API_KEY}`)
                                            .then(res => {                
                                                const singleMovie = res.data;
                                                console.log(singleMovie, 'movie');
                                                this.setState({ singleMovieData: singleMovie, imdbID: movie.imdbID });
                                            }))}
                                        >
                                            {movie.Title} ({movie.Year})
                                        </h4>
                                        {this.state.imdbID === movie.imdbID ? `Actors - ${singleMovieData.Actors}` : ''}
                                    </div>
                                </div>
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
            <div className="row mt-3">
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
                                        <SearchIcon fontSize="default" />
                                    </Button>
                                </InputAdornment>
                              )
                        }}
                        onChange={this.onChange}
                        value={this.state.query !== '' ? this.state.query : ''}
                    />
                    <Button className="openBtn" variant="contained" size="medium" color="secondary" onClick={this.handleExpandOpen}>
                        Advanced Search
                        <ExpandMoreIcon color="inherit" />
                    </Button>
                    <Collapse in={this.state.displayToggle} timeout="auto" unmountOnExit className="mt-3">
                        <Card style={{maxWidth: '100%'}}>
                            <CardContent>
                                <Typography gutterBottom variant="h5" style={{fontFamily: 'Raleway'}} component="h5">
                                    Select Movie Type
                                </Typography>
                                <FormControl variant="outlined" style={{minWidth: 120}}>
                                    <Select
                                        value={this.state.type}
                                        onChange={this.onChange}
                                        displayEmpty
                                        name="type" 
                                        style={{fontFamily: 'Raleway'}}
                                    >
                                        <MenuItem value="">
                                            <em>Both</em>
                                        </MenuItem>
                                        <MenuItem value="movie">Movie</MenuItem>
                                        <MenuItem value="series">Series</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Collapse>
                </form>
                
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
