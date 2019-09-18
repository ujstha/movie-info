import React from 'react';

const Suggestions = (props) => {
  const options = props.movieData.map((r, i) => (
    <li key={i}>
      {r.Title}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions;