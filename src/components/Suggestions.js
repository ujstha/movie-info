import React from 'react';

const Suggestions = (props) => {
  const options = props.movieData.map(r => (
    <li key={r.imdbID}>
      {r.Title}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions;