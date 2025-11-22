// Example Jest test for Kone Consult API
const { getPublishedProjects, getMessages, getReceipts } = window.KoneConsultAPI;

test('getPublishedProjects returns a promise', () => {
  expect(typeof getPublishedProjects().then).toBe('function');
});

test('getMessages returns a promise', () => {
  expect(typeof getMessages().then).toBe('function');
});

test('getReceipts returns a promise', () => {
  expect(typeof getReceipts().then).toBe('function');
});
