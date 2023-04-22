import React from 'react'
import browser from 'webextension-polyfill';
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { buttons as Content } from '@src/content.json'
import { SearchStatus, SearchStatusType } from '@src/lib/internal-types'
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { MainButton, SearchMessage } from './MainButton'

describe('Render MainButton', () => {
    it('should render a "stop search" button if search is started or warning', () => {
      render(<MainButton searchStatusType={SearchStatusType.Started} enabled={true} />)
      
      expect(screen.getByRole('button', { name: Content.stopSearch })).toBeInTheDocument()
    })
  
    it('Should render a "waiting" button if search is waiting', () => {  
        render(<MainButton searchStatusType={SearchStatusType.Waiting} enabled={true} />)
      
      expect(screen.getByRole('button', { name: Content.waiting })).toBeInTheDocument()
    })
  
    it('Should render a "search" button if search is stopped, warning or waiting', () => {
      render(<MainButton searchStatusType={SearchStatusType.Stopped} enabled={true} />)
      
      expect(screen.getByRole('button', { name: Content.search })).toBeInTheDocument()
    })
  
    it('Should disable the "search" button if enabled is false', () => {
      render(<MainButton searchStatusType={SearchStatusType.Stopped} enabled={false} />)
      
      expect(screen.getByRole('button', { name: Content.search })).toBeDisabled()
    })
})

describe('Render search message', () => {
    it('Should render an error message if searchStatus type is error', () => {
        const searchStatus: SearchStatus = { type: SearchStatusType.Error, message: 'Something went wrong' }

        render(<SearchMessage searchStatus={searchStatus} />)
        
        const errorMessage = screen.getByText(/something went wrong/i)
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveClass('error')
    })

    it('Should render a warning message if searchStatus type is warning', () => {
        const searchStatus: SearchStatus = { type: SearchStatusType.Warning, message: 'Be careful' }

        render(<SearchMessage searchStatus={searchStatus} />)
        
        const warning = screen.getByText(/be careful/i)
        expect(warning).toBeInTheDocument()
        expect(warning).toHaveClass('warning')
    })

    it('Should render a message with no color class if searchStatus type is not error or warning', () => {
        const searchStatus: SearchStatus = { type: SearchStatusType.Stopped, message: 'No message' }

        render(<SearchMessage searchStatus={searchStatus} />)
        
        const message = screen.getByText(/no message/i)
        expect(message).toBeInTheDocument()
        
        expect(message).not.toHaveClass('error')
        expect(message).not.toHaveClass('warning')
    })
})

describe('Integrate MainButton', () => {
    it('Should send the StartSearch message to the browser after clicking a stopped button', async () => {
        const onMessage = jest.fn()
        browser.runtime.onMessage.addListener(onMessage)

        render(<MainButton searchStatusType={SearchStatusType.Stopped} enabled={true} />)
        
        const searchButton = screen.getByText(Content.search)
        userEvent.click(searchButton)
        
        await waitFor(() => expect(onMessage).toHaveBeenCalledWith<PlatformMessage[]>({ action: ActionTypes.StartSearch }))
    })

    it('Should send the StopSearch message to the browser after clicking an active button', async () => {
        const onMessage = jest.fn()
        
        browser.runtime.onMessage.addListener(onMessage)

        render(<MainButton searchStatusType={SearchStatusType.Started} enabled={true} />)
        
        const searchButton = screen.getByText(Content.stopSearch)
        userEvent.click(searchButton)
        
        await waitFor(() => expect(onMessage).toHaveBeenCalledWith<PlatformMessage[]>({ action: ActionTypes.StopSearch }))
    })

    it('Should set the search status to error when error occurs', async () => {
        const onMessage = jest.fn((message: PlatformMessage) => {
            if (message.action === ActionTypes.StartSearch) {
                browser.runtime.sendMessage({ action: ActionTypes.SetSearchStatus, status: { type: SearchStatusType.Error } } as PlatformMessage)
            }
        })
        
        browser.runtime.onMessage.addListener(onMessage)

        render(<MainButton searchStatusType={SearchStatusType.Stopped} enabled={true} />)
        
        const searchButton = screen.getByText(Content.search)
        userEvent.click(searchButton)
        
        await waitFor(() => expect(onMessage).toHaveBeenCalledWith<PlatformMessage[]>({
            action: ActionTypes.SetSearchStatus,
            status: { type: SearchStatusType.Error }
        }))
    })
})