'use client'
import { useState, useEffect, Suspense} from 'react'
import InputText from '@/components/inputText'
import SubmitButton from '@/components/submitButton'
import { useCategoryHook } from '@/hooks/category.hook'
import { useAsyncHook } from '@/hooks/async.hook'
import { X } from 'lucide-react'

export default function CategoriesForm() {
  const { categories, selectedCategoryType, setSelectedCategoryType, getCategoriesByType, addCategory, getAllCategories, deleteCategory } = useCategoryHook();

  const [newCategoryName, setNewCategoryName] = useState<string>('')

  const { isLoading } = useAsyncHook()

  const handleCategoryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryType(event.target.value as 'predefined' | 'custom' | 'all')
  }

  const addNewCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newCategoryName === '') {
      
      return alert('O nome da categoria não pode ser vazio')
    }

    addCategory(newCategoryName, 'custom')
    setNewCategoryName('')
  }

  const handleDeleteCategory = async (id: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar essa categoria?')
    if (confirmDelete) {
      await deleteCategory(id)
    }
  }

  const fetchCategories = async () => {
    getAllCategories()
    if (selectedCategoryType !== 'all') {
      getCategoriesByType()
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [selectedCategoryType])

  return (
    <>
    <div>
        <form className='flex flex-col gap-4 ' onSubmit={addNewCategory}>
          <div className='flex gap-4 items-center'>
            <div>
              <label className='text-violet-400' htmlFor='categoryType'>
                Tipo do modelo
              </label>
              <select
                className='flex items-center gap-2 max-w-[238px] h-[48px] rounded-md border-2 border-zinc-500 bg-black/60 p-1 px-2'
                onChange={handleCategoryTypeChange}
                value={selectedCategoryType}
                defaultValue={selectedCategoryType}
              >
                <option value='predefined'>Pré-definida</option>
                <option value='custom'>Personalizada</option>
                <option value='all'>Todas</option>
              </select>
            </div>
          </div>
          <div className='flex gap-4 flex-col md:flex-row md:items-end'>
            <div className='w-[358px]'>
              <span className='text-violet-400'>Adicionar nova categoria</span>
              <InputText
                placeholder='Nome da categoria'
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
              />
            </div>
            <div className='flex gap-4 flex-wrap items-end'>
              <SubmitButton text='Adicionar' type='submit' loading={isLoading} />
            </div>
          </div>
        </form>
      </div>
      <div className='min-w-[378px] w-auto mt-12'>
        <h2 className='text-xl mb-2 text-violet-400'>Lista de categorias</h2>
        <Suspense fallback={<p>Carregando...</p>}>
          <hr className='bg-zinc-700' />
          <div className='flex gap-2 flex-wrap my-6'>
            {categories?.map((category, index) => (
              <span className='bg-zinc-900 text-white p-2 rounded-md flex gap-2 items-center' key={index}>
                {category.name}
                { category.type === 'custom' && <X className='cursor-pointer' size={16} onClick={() => handleDeleteCategory(category.id)} />}
              </span>
            ))}
          </div>
        </Suspense>
      </div>
    </>
  )
}