// import { getID } from '../lib/utils';
// import * as actions from '../consts/action-types';

/*
const reducer = (state, action) => {
  console.log('Got Action ' + action.type, action);

  switch (action.type) {
    case actions.ADD_RASTER:
      const newRaster = {
        name: action.name,
        id: getID(),
        title: action.title,
        desc: action.desc,
        favorite: false
      };

      const newRasters = state.layers.concat(newRaster);

      return Object.assign({}, state, {
        rasters: newRaster
      });

    case actions.TOGGLE_FAVORITE:
      return Object.assign({}, state, {
        recipes: state.recipes.map(r => r.id !== action.id ?
          r : Object.assign({}, r, { favorite: !r.favorite}))
      });
      
    default:
      return state;
  }
};

export default reducer;*/