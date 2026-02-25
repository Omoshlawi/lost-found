import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Box, Image } from '@mantine/core';
import logoHorizontal from './logo-horizontal.png';
import logoIcon from './logo-icon.png';
import logoName from './logo-name.png';
import logoVertical from './logo-vertical.png';
import styles from './Logo.module.css';

type LogoProps = {
  mode?: 'name' | 'icon' | 'vertical' | 'horizontal';
};
const Logo: FC<LogoProps> = ({ mode = 'horizontal' }) => {
  return (
    <Box
      className={styles.logoContainer}
      component={Link}
      to="/"
      style={{ textDecoration: 'none' }}
    >
      <Image
        src={
          mode === 'name'
            ? logoName
            : mode === 'vertical'
              ? logoVertical
              : mode === 'horizontal'
                ? logoHorizontal
                : logoIcon
        }
        h={40}
        w="auto"
        fit="contain"
        style={{ cursor: 'pointer' }}
      />
    </Box>
  );
};

export default Logo;
