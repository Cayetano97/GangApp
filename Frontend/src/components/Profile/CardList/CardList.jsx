import "./CardList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../Spinner/Spinner";

const CardList = (props) => {
  return (
    <div className="singlelist">
      {props.isLoading ? (
        <Spinner />
      ) : props.error ? (
        <p>Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!</p>
      ) : props.dataResponse.data === undefined ? (
        <Spinner />
      ) : props.dataResponse.data.length === 0 ? (
        <p>Aún no tienes ninguna lista.</p>
      ) : (
        props.dataResponse.data.map((list, index) => {
          return (
            <div className="list" key={list._id}>
              <div className="info">
                <h5>{list.name_list}</h5>
                <span
                  className={
                    list.status === "Guardada"
                      ? "saved"
                      : list.status === "Comprando"
                      ? "shopping"
                      : "finished"
                  }
                >
                  {list.status}
                </span>
              </div>
              <div className="products">
                {list.id_products.length === 0 ? (
                  <>
                    <p>Todavía no hay añadido ningún producto.</p>
                    <button
                      className="open-list-noProducts"
                      onClick={props.handleOpenList.bind(this, index)}
                    >
                      Ver lista
                      <FontAwesomeIcon icon={faArrowRightLong} />
                    </button>
                  </>
                ) : (
                  <>
                    <ul>
                      {list.id_products.length > 4 ? (
                        <>
                          {list.id_products.slice(0, 4).map((product) => {
                            return <li key={product.id}>{product.name}</li>;
                          })}
                          <p className="more">...</p>
                        </>
                      ) : (
                        list.id_products.slice(0, 4).map((product) => {
                          return <li key={product.id}>{product.name}</li>;
                        })
                      )}
                    </ul>
                    <div className="cardlist-footer">
                      <div className="cardlist-footer-left">
                        <p>{new Date(list.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        className="open-list"
                        onClick={props.handleOpenList.bind(this, index)}
                      >
                        Ver lista
                        <FontAwesomeIcon icon={faArrowRightLong} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CardList;
