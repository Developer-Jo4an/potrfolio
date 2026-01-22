export function getActiveModals(modals) {
  return modals.reduce((acc, modalData) => {
    const isVisible = !modalData.isQueue || !acc.some(({isQueue}) => isQueue);
    if (isVisible) acc.push(modalData);
    return acc;
  }, []);
}
