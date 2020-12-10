import React from 'react';
import { Link } from 'gatsby';

import Container from 'components/ui/Container';
import Button from 'components/ui/Button';
import TitleSection from 'components/ui/TitleSection';

import * as Styled from './styles';

interface Props {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  linkTo: string;
  linkText: string;
}

const Banner: React.FC<Props> = ({ title, subtitle, content, linkTo, linkText }) => (
  <Styled.Banner>
    <Container section>
      <TitleSection title={title} subtitle={subtitle} />
      <Styled.Content>
      My name is <strong>Dhen Emmanuel Padilla</strong>.<br/> 
      I am a recent Computer Science masters graduate, from University College London. Currently a Software Engineer at <Link to={'https://www.arm.com/'}>ARM</Link> and applying for research opportunities and PhDs in Computer Science.
      My interests lie in <strong>Deep Neural Networks</strong>, specifically <strong>NLP</strong> and <strong>Decentralised Ledger Technologies</strong>.
      Driven to create social change and determined to impact the world in a positive way. 
      Check out projects I've worked on <Link to={'/projects/'}>here</Link>, and my CV <Link to={'/resume/'}>here</Link>.
      Enjoy your stay! 💁🏻‍♂️
      </Styled.Content>
    </Container>
  </Styled.Banner>
);

export default Banner;
