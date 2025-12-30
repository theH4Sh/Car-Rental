import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import Card from '../components/Card'
import SkeletonCard from '../components/SkeletonCard'
import { useFetch } from '../hooks/useFetch'
import { carCover } from '../utils/api'

const FUEL_TYPES = ['all', 'petrol', 'diesel', 'electric', 'hybrid']

const Rent = () => {
  const { data: cars, isLoading, error } = useFetch('api/car/')
  const [searchParams] = useSearchParams()

  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('price') || '')
  const [seats, setSeats] = useState(searchParams.get('seats') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [fuelType, setFuelType] = useState('all')

  const fleet = useMemo(() => (Array.isArray(cars) ? cars : []), [cars])

  const brands = useMemo(() => {
    const set = new Set(fleet.map((c) => c.brand).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [fleet])

  const locations = useMemo(() => {
    const set = new Set(fleet.map((c) => c.location).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [fleet])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const priceCap = maxPrice ? Number(maxPrice) : null
    const minSeats = seats ? Number(seats) : null
    const locationFilter = location.trim().toLowerCase()

    return fleet.filter((car) => {
      const matchesQuery =
        !q ||
        car.name?.toLowerCase().includes(q) ||
        car.brand?.toLowerCase().includes(q) ||
        car.location?.toLowerCase().includes(q) ||
        car.description?.toLowerCase().includes(q)

      const matchesBrand = brand === 'all' || car.brand === brand
      const matchesPrice = priceCap == null || Number.isNaN(priceCap) || car.pricePerDay <= priceCap
      const matchesSeats =
        minSeats == null || Number.isNaN(minSeats) || (car.seats != null && car.seats >= minSeats)
      const matchesLocation =
        !locationFilter ||
        locationFilter === 'all' ||
        car.location?.toLowerCase().includes(locationFilter)
      const matchesFuel = fuelType === 'all' || car.fuelType === fuelType

      return (
        matchesQuery &&
        matchesBrand &&
        matchesPrice &&
        matchesSeats &&
        matchesLocation &&
        matchesFuel
      )
    })
  }, [fleet, query, brand, maxPrice, seats, location, fuelType])

  const clearFilters = () => {
    setQuery('')
    setBrand('all')
    setMaxPrice('')
    setSeats('')
    setLocation('')
    setFuelType('all')
  }

  const hasFilters =
    query || brand !== 'all' || maxPrice || seats || location || fuelType !== 'all'

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-4 space-y-8 pb-10">
      <div className="text-center md:text-left space-y-2">
        <p className="text-[#e93c3d] font-bold tracking-wide uppercase text-sm">Rent a car</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#331512]">Find your next ride</h1>
        <p className="text-[#513336] font-medium max-w-2xl">
          Browse the TOPCAR fleet, filter by seats, fuel, location, or budget, then open a car to book.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl border border-stone-100 p-4 md:p-5 space-y-3">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, brand, or location"
              className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          >
            {brands.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? 'All brands' : b}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price / day"
            className="w-full border border-gray-200 rounded-xl py-3 px-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            placeholder="Min seats"
            className="w-full border border-gray-200 rounded-xl py-3 px-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400"
          />

          <select
            value={location || 'all'}
            onChange={(e) => setLocation(e.target.value === 'all' ? '' : e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'all' ? 'All locations' : loc}
              </option>
            ))}
          </select>

          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 px-3 font-semibold outline-none focus:ring-2 focus:ring-gray-400 bg-white capitalize"
          >
            {FUEL_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'all' ? 'All fuel types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#513336]">
          {isLoading
            ? 'Loading fleet…'
            : `${filtered.length} car${filtered.length !== 1 ? 's' : ''} available`}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-[#e93c3d] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {isLoading && Array(6).fill(0).map((_, id) => <SkeletonCard key={id} />)}

        {!isLoading && !error && filtered.map((car) => (
          <Link to={`/details/${car._id}`} key={car._id}>
            <Card
              carName={car.name}
              location={car.location || car.brand}
              price={car.pricePerDay}
              seats={car.seats}
              fuelType={car.fuelType}
              image={import.meta.env.VITE_API + 'images/' + carCover(car)}
            />
          </Link>
        ))}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="font-semibold text-[#331512]">No cars match your filters</p>
            <p className="mt-1 text-sm">Try different seats, fuel, location, or price.</p>
          </div>
        )}

        {error && (
          <div className="col-span-full text-center text-red-500 py-10">
            Couldn’t load cars. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}

export default Rent
