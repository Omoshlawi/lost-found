import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image } from '@mantine/core';
import logoName from './logo-name.png';
import image from './logo.png';
import styles from './Logo.module.css';

type LogoProps = {
  mode?: 'name' | 'icon';
};
const Logo: FC<LogoProps> = ({ mode = 'name' }) => {
  return (
    <Box
      className={styles.logoContainer}
      component={Link}
      to="/"
      style={{ textDecoration: 'none' }}
    >
      <Image
        src={mode === 'name' ? logoName : image}
        h={40}
        w="auto"
        fit="contain"
        style={{ cursor: 'pointer' }}
      />
    </Box>
  );
};

export default Logo;
