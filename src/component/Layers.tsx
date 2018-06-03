import * as React from 'react';
//import PropTypes from 'prop-types-ts';
import { connect } from 'react-redux';
import Layer from '../models/Layer';
import { toggleFavorite } from '../actions/layers';

const Layers = ({ layers: Layer[] , toggle }) => (
    <ul>
        { layers.map(layer => <Layer key={ layer.id } recipe={ layer } toggle={ toggle } />) }
</ul>
);

/*
Layers.propTypes = {
    layers: PropTypes.array.isRequired,
    toggle: PropTypes.func.isRequired
};*/

const mapStateToProps = (state) => ({
    recipes: state.recipes
});

export default connect(mapStateToProps, { toggle: toggleFavorite })(Layers);