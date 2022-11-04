import React from 'react';
import { shallow } from 'enzyme';
import Chats from '../../../src/Pages/Chats/Chats';
import * as Routers from 'react-router';

const location = jest.fn();
describe('Chat Component', () => {
  jest.spyOn(Routers, 'useLocation').mockImplementation(() => location);
  describe('render Chat Component', () => {
    it('without crashing', () => {
      shallow(<Chats />);
    });
  });
});

it('should show correct text in title', () => {
  jest.spyOn(Routers, 'useLocation').mockImplementation(() => location);
  const wrapper = shallow(<Chats />);
  expect(wrapper.text().includes('/Chat Demo/i')).toBe(false);
});

it('video should be rendered', () => {
  jest.spyOn(Routers, 'useLocation').mockImplementation(() => location);
  const wrapper = shallow(<Chats />);
  wrapper.find('video').simulate('ended');
  expect(wrapper.text()).toBeDefined();
});

it('button should be rendered', () => {
  jest.spyOn(Routers, 'useLocation').mockImplementation(() => location);
  const wrapper = shallow(<Chats />);
  wrapper.find('Button').simulate('click');
  expect(wrapper.text()).toBe('Contact Sales');
});
