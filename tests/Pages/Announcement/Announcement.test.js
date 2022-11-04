import { createEvent, render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Announcement from '../../../src/Pages/Announcement/Announcement';

const MockAnnouncement = () => {
  return (
    <Router>
      <Announcement />
    </Router>
  );
};

describe('Announcement page', () => {
  beforeEach(() => {
    render(<MockAnnouncement />);
  });

  it('should render component', async () => {
    const title = screen.getByText(/Announcements/i);
    expect(screen.getByRole('option', { name: 'All Organizations' }).selected).toBe(true);
    const sendButton = screen.getByRole('button', { name: /Send/i });
    expect(title).toBeInTheDocument();
    expect(sendButton).toBeInTheDocument();
  });

  it('should correctly set default option', async () => {
    expect(screen.getByRole('option', { name: 'All Organizations' }).selected).toBe(true);
  });

  it('should display the correct number of options', () => {
    expect(screen.getAllByRole('option').length).toBe(2);
  });

  it('should allow user to change option to specific organization', () => {
    userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'Specific Organization' }));
    expect(screen.getByRole('option', { name: 'Specific Organization' }).selected).toBe(true);
  });

  it('should allow user to change option to All organizations', () => {
    userEvent.selectOptions(screen.getByRole('combobox'), screen.getByRole('option', { name: 'All Organizations' }));
    expect(screen.getByRole('option', { name: 'All Organizations' }).selected).toBe(true);
  });

  it('options in editor', () => {
    const bold = screen.getByTitle('Bold');
    const italic = screen.getByTitle('Italic');
    const underline = screen.getByTitle('Underline');
    const link = screen.getByTitle('Link');
    const unlink = screen.getByTitle('Unlink');
    const editor = screen.getByRole('textbox', { hidden: false });

    expect(bold).toBeInTheDocument();
    expect(italic).toBeInTheDocument();
    expect(underline).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(unlink).toBeInTheDocument();
    expect(editor).toBeInTheDocument();
  });

  it('should allow user to change option to All organizations', () => {
    const textarea = screen.getByRole('textbox');
    const event = createEvent.paste(textarea, {
      clipboardData: {
        types: ['text/plain'],
        getData: () => 'MyText',
      },
    });
    fireEvent(textarea, event);
  });
});
