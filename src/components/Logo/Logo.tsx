import { Box, Image, Text } from '@mantine/core';
import image from './logo.png';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Box flex={1} display={'flex'} className={styles.logoContainer} p={'xs'}>
      <Image src={image} h={'30'} w={'30'} />
    </Box>
  );
};

export default Logo;
