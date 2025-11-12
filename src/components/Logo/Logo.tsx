import { Link } from 'react-router-dom';
import { Box, Image } from '@mantine/core';
import image from './logo.png';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Box
      className={styles.logoContainer}
      component={Link}
      to="/"
      style={{ textDecoration: 'none' }}
    >
      <Image src={image} h={40} w="auto" fit="contain" style={{ cursor: 'pointer' }} />
    </Box>
  );
};

export default Logo;
