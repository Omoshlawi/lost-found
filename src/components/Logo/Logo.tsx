import { Box, Image, Text } from '@mantine/core';
import image from './logo.png';
import styles from './Logo.module.css';

const Logo = () => {
  return (
    <Box display={'flex'} className={styles.logoContainer} w={'fit-content'}>
      <Image src={image} h={'30'} w={'30'} />
      <Text fw={'bold'} size="xl">
        Docufind
      </Text>
    </Box>
  );
};

export default Logo;
