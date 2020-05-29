const addExcuse = (excuse) => {
  return (dispatch) => {
    return fetch('/api/excuse', {
      method: 'POST',
      body: JSON.stringify({ excuse }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => console.log(res))
  };
};

export default addExcuse;