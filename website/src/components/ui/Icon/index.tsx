import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faLaptopCode,
  faDrawPolygon,
  faEdit,
  faBullhorn,
  faMapMarkerAlt,
  faPhone,
  faPaperPlane,
  faBrain,
  faCubes,
  faDiceD20,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

/* add any additional icon to the library */
library.add(
  fab, 
  faLaptopCode, 
  faDrawPolygon, 
  faEdit, 
  faEdit, 
  faBullhorn, 
  faMapMarkerAlt, 
  faPhone, 
  faPaperPlane, 
  faBrain,
  faCubes, 
  faDiceD20,
  faHandHoldingHeart);

export type IconProps = FontAwesomeIconProps['icon'];

const Icon: React.FC<FontAwesomeIconProps> = ({ ...props }) => <FontAwesomeIcon {...props} />;

export default Icon;
