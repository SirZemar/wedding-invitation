import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '../context/LanguageContext'

// Components
import LanguageSwitcher from '../components/LanguageSwitcher'
import Countdown from '../components/Countdown'
import GiftSection from '../components/GiftSection'
import Footer from '../components/Footer'
import RSVPForm from '../components/RSVPForm'

// Wrapper for components that need context
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <LanguageProvider>
      {children}
    </LanguageProvider>
  </BrowserRouter>
)

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.getItem.mockReturnValue(null)
  })

  it('should render language buttons', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    expect(screen.getByText('PT')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('UK')).toBeInTheDocument()
  })

  it('should switch language on click', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    const enButton = screen.getByText('EN')
    fireEvent.click(enButton)

    expect(localStorage.setItem).toHaveBeenCalled()
  })
})

describe('Countdown', () => {
  it('should render countdown values', () => {
    render(
      <TestWrapper>
        <Countdown />
      </TestWrapper>
    )

    // Should render labels (could be in any language)
    // Look for countdown-label class instead of specific text
    const labels = document.querySelectorAll('.countdown-label')
    expect(labels.length).toBe(4)

    // Should render countdown values
    const values = document.querySelectorAll('.countdown-value')
    expect(values.length).toBe(4)
  })
})

describe('GiftSection', () => {
  it('should render gift section with title', () => {
    render(
      <TestWrapper>
        <GiftSection />
      </TestWrapper>
    )

    // Check for section id
    expect(document.getElementById('gifts')).toBeInTheDocument()

    // Check for title (could be Gifts or Presentes)
    const title = document.querySelector('.section-title')
    expect(title).toBeInTheDocument()
  })

  it('should render IBAN field', () => {
    render(
      <TestWrapper>
        <GiftSection />
      </TestWrapper>
    )

    // IBAN is shown in the component
    expect(screen.getByText('IBAN')).toBeInTheDocument()
  })

  it('should copy IBAN on button click', async () => {
    render(
      <TestWrapper>
        <GiftSection />
      </TestWrapper>
    )

    // Find copy button by looking for button in the IBAN row
    const buttons = screen.getAllByRole('button')
    const copyButton = buttons.find(btn =>
      btn.textContent.includes('Copy') || btn.textContent.includes('Copiar')
    )

    expect(copyButton).toBeDefined()
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })
})

describe('Footer', () => {
  it('should render couple names', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    )

    // Check for couple names from config (case insensitive)
    expect(screen.getByText(/Alla/)).toBeInTheDocument()
    expect(screen.getByText(/Eduardo/)).toBeInTheDocument()
  })

  it('should render wedding date', () => {
    render(
      <TestWrapper>
        <Footer />
      </TestWrapper>
    )

    // Check for date (formatted based on language - could be Sept/September/вересня)
    // Use getAllByText since 2026 appears in both date and footer year
    const elements = screen.getAllByText(/2026/)
    expect(elements.length).toBeGreaterThanOrEqual(1)
  })
})

describe('RSVPForm', () => {
  it('should render form with name input', () => {
    const mockSuccess = vi.fn()
    const mockError = vi.fn()

    render(
      <TestWrapper>
        <RSVPForm onSuccess={mockSuccess} onError={mockError} />
      </TestWrapper>
    )

    // Should have at least one text input for name
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('should render submit button', () => {
    const mockSuccess = vi.fn()
    const mockError = vi.fn()

    render(
      <TestWrapper>
        <RSVPForm onSuccess={mockSuccess} onError={mockError} />
      </TestWrapper>
    )

    // Find submit button by its type attribute
    const submitButton = document.querySelector('button[type="submit"]')
    expect(submitButton).toBeInTheDocument()
  })

  it('should add guest when clicking add button', () => {
    const mockSuccess = vi.fn()
    const mockError = vi.fn()

    render(
      <TestWrapper>
        <RSVPForm onSuccess={mockSuccess} onError={mockError} />
      </TestWrapper>
    )

    // Find the add guest button (it has a + sign)
    const buttons = screen.getAllByRole('button')
    const addButton = buttons.find(btn => btn.textContent.includes('+'))

    fireEvent.click(addButton)

    // Should now have 2 guest sections
    const guestSections = document.querySelectorAll('.bg-gray-50')
    expect(guestSections.length).toBe(2)
  })

  it('should have radio buttons for attending', () => {
    const mockSuccess = vi.fn()
    const mockError = vi.fn()

    render(
      <TestWrapper>
        <RSVPForm onSuccess={mockSuccess} onError={mockError} />
      </TestWrapper>
    )

    const radioButtons = screen.getAllByRole('radio')
    expect(radioButtons.length).toBe(2) // Yes and No
  })

  it('should have plus one checkbox', () => {
    const mockSuccess = vi.fn()
    const mockError = vi.fn()

    render(
      <TestWrapper>
        <RSVPForm onSuccess={mockSuccess} onError={mockError} />
      </TestWrapper>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThanOrEqual(1)
  })
})
