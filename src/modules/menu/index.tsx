const Menu = () => {
  return (
    <ul className="grid w-full grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8" data-testid="menu-list">
      <li>
        <div className="menu-wrapper">
          <div className="rounded-lg aspect-[16/9]"></div>
        </div>
      </li>
    </ul>
  )
}

export default Menu
