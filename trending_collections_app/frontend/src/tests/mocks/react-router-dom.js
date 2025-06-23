// Mock for react-router-dom
const mockNavigate = jest.fn();

module.exports = {
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  Navigate: ({ to }) => `Navigate to ${to}`,
  useNavigate: () => mockNavigate,
  mockNavigate
};