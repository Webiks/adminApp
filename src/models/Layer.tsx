import * as React from 'react';
//import PropTypes from 'prop-types';
import classNames from 'classnames';

const Layer = ({ layer , toggle }) => (
    <li className={ classNames({ 'favorite': layer.favorite }) }
onClick={ () => toggle(layer.id) }>
{ layer.id} ({layer.href})
</li>
);

/*
Layer.propTypes = {
    layer: PropTypes.object.isRequired,
    toggle: PropTypes.func.isRequired,
};*/

export default Layer;