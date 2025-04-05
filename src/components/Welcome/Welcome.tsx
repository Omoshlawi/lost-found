import { Link } from 'react-router-dom';
import { Anchor, Button, Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title ta="center" mt={100} order={1}>
        Welcome to{' '}
      </Title>
      <Title className={classes.title} ta="center" mt={10}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          Lost and Found
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Lost and Found is a platform that helps you find and return lost items. You can easily
        report lost items, browse through found items, and connect with others in your community.
        <br />
      </Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Link to={'/items/report'}>
          <Button size="xl" variant="gradient" gradient={{ from: 'pink', to: 'yellow' }}>
            Get Started Now
          </Button>
        </Link>
      </div>
    </>
  );
}
