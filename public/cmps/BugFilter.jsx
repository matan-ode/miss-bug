import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 700))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { title, sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter Our Bugs</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Title</label>
                <input value={title} onChange={handleChange} name="title" type="text" id="txt" />
                <button>Submit</button>
            </form>
            <select value={sortBy} onChange={handleChange} name="sortBy" id="sortBy">
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Time</option>
            </select>
            <input value={sortDir} onChange={handleChange} type="checkbox" id="sortDir" name="sortDir"></input>
            <label htmlFor="sortDir">Direction</label>
        </section>
    )
}