import { useEffect, useState, useCallback } from "react";
import classes from "./foodsAdminPage.module.css";
import { Link, useParams } from "react-router-dom";
import { deleteById, getAll, search } from "../../services/foodService";
import NotFound from "../../components/NotFound/NotFound";
import Title from "../../components/Title/Title";
import Search from "../../components/Search/Search";
import Price from "../../components/Price/Price";
import { toast } from "react-toastify";

export default function FoodsAdminPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useParams();

  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = searchTerm ? await search(searchTerm) : await getAll();
      setFoods(data);
    } catch (err) {
      setError("Failed to load foods");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]); // Add loadFoods as a dependency

  const FoodsNotFound = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (foods.length > 0) return null;

    return searchTerm ? (
      <NotFound linkRoute="/admin/foods" linkText="Show All" />
    ) : (
      <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
    );
  };

  const deleteFood = async (food) => {
    if (!window.confirm(`Delete Food ${food.name}?`)) return;

    try {
      await deleteById(food.id);
      toast.success(`"${food.name}" Has Been Removed!`);
      setFoods(foods.filter((f) => f.id !== food.id));
    } catch (err) {
      toast.error(`Failed to delete "${food.name}".`);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <Title title="Manage Foods" margin="1rem auto" />
        <Search
          searchRoute="/admin/foods/"
          defaultRoute="/admin/foods"
          margin="1rem 0"
          placeholder="Search Foods"
        />
        <Link to="/admin/addFood" className={classes.add_food}>
          Add Food +
        </Link>
        <FoodsNotFound />
        {foods.map((food) => (
          <div key={food.id} className={classes.list_item}>
            <img
              src={food.imageUrl}
              alt={food.name}
              className={classes.image}
            />
            <Link to={`/food/${food.id}`}>{food.name}</Link>
            <Price price={food.price} />
            <div className={classes.actions}>
              <Link to={`/admin/editFood/${food.id}`}>Edit</Link>
              <button
                onClick={() => deleteFood(food)}
                className={classes.delete_button}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
