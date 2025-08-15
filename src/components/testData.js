import { supabase } from '@/lib/supabaseClient'

const TestData = () => {
  const createSampleData = async () => {
    try {
      // Create sample profile
      const { data: profile } = await supabase
        .from('profiles')
        .insert([{
          email: 'test@example.com',
          full_name: 'Test User'
        }])
        .select()
        .single()

      // Create sample address
      const { data: address } = await supabase
        .from('addresses')
        .insert([{
          user_id: profile.user_id,
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postal_code: '10001',
          country: 'USA'
        }])
        .select()
        .single()

      // Create sample product
      const { data: product } = await supabase
        .from('products')
        .insert([{
          name: 'Premium Yoga Mat',
          description: 'Eco-friendly non-slip mat',
          price: 2499.00,
          material: 'Rubber'
        }])
        .select()
        .single()

      // Create sample variant
      const { data: variant } = await supabase
        .from('variants')
        .insert([{
          product_id: product.product_id,
          attributes: { color: 'blue', size: 'standard' },
          stock: 100,
          test_restricted: false
        }])
        .select()
        .single()

      // Create sample order
      const { data: order } = await supabase
        .from('orders')
        .insert([{
          user_id: profile.user_id,
          address_id: address.address_id,
          total: 2499.00,
          status: 'pending'
        }])
        .select()
        .single()

      // Create order item
      await supabase
        .from('order_items')
        .insert([{
          order_id: order.order_id,
          variant_id: variant.variant_id,
          quantity: 1,
          price: 2499.00
        }])

      // Create payment
      await supabase
        .from('payments')
        .insert([{
          order_id: order.order_id,
          amount: 2499.00,
          method: 'card',
          status: 'pending'
        }])

      console.log('Sample data created successfully!')
    } catch (error) {
      console.error('Error creating sample data:', error)
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={createSampleData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Sample Data
      </button>
    </div>
  )
}

export default TestData