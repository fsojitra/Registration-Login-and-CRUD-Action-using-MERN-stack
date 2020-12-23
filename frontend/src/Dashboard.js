import React, { Component } from 'react';
import {
  Button, TextField, Input, Dialog, DialogActions,
  DialogTitle, DialogContent, TableBody, Table,
  TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';

const axios = require('axios');

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      category_name: '',
      token: '',
      openCategoryModal: false,
      openSubCategoryModal: false,
      openProductModal: false,
      name: '',
      desc: '',
      price: '',
      discount: '',
      cate_id: '',
      file: null,
      sub_cat_id: '',
      page: 1,
      search: '',
      products: [],
      pages: 0
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.setState({ token: token }, () => {
        this.getProduct();
      });
    }
  }

  getProduct = () => {
    let data = '?';
    data = data + 'page=' + this.state.page;
    if (this.state.search) {
      data = data + '&search=' + this.state.search;
    }
    axios.get('http://localhost:2000/get-product' + data, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({ products: res.data.products, pages: res.data.pages });
    }).catch((err) => {
      this.setState({ products: [], pages: 0 });
      console.log(err);
    });
  }

  deleteProduct = (id) => {
    axios.post('http://localhost:2000/delete-product', {
      id: id
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      console.log(res);
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getProduct();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
    });
    if (e.target.name == 'search') {
      this.setState({ page: 1 }, () => {
        this.getProduct();
      });
    }
  };

  addCategory = (type) => {

    axios.post('http://localhost:2000/add-category', {
      name: this.state.category_name,
      type: type,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      console.log(res);
      this.handleClose();
      this.handleSubCatClose();
    }).catch((err) => {
      console.log(err);
      this.handleClose();
      this.handleSubCatClose();
    });

  };

  addProduct = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append('file', fileInput.files[0]);
    file.append('name', this.state.name);
    file.append('desc', this.state.desc);
    file.append('discount', this.state.discount);
    file.append('price', this.state.price);
    file.append('cate_id', '5fd6dbbda92e67402cb01558');
    file.append('sub_cat_id', '5fd6dba632c3ae3fec5e2576');

    axios.post('http://localhost:2000/add-product', file, {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {
      console.log(res);
      this.handleProductClose();
      this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
        this.getProduct();
      });
    }).catch((err) => {
      console.log(err);
      this.handleProductClose();
    });

  }

  handleOpen = () => {
    this.setState({ openCategoryModal: true, category_name: '' });
  };

  handleClose = () => {
    this.setState({ openCategoryModal: false, category_name: '' });
  };

  handleSubCatOpen = () => {
    this.setState({ openSubCategoryModal: true, category_name: '' });
  };

  handleSubCatClose = () => {
    this.setState({ openSubCategoryModal: false, category_name: '' });
  };

  handleProductOpen = () => {
    this.setState({ openProductModal: true, category_name: '' });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false, category_name: '' });
  };

  render() {
    return (
      <div>
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleOpen}
          >
            Add Category
          </Button>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleSubCatOpen}
          >
            Add Sub Category
          </Button>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleProductOpen}
          >
            Add Product
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Add Category */}
        <Dialog
          open={this.state.openCategoryModal}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Category</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category_name"
              value={this.state.category_name}
              onChange={this.onChange}
              placeholder="Category Name"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.category_name == ''}
              onClick={(e) => this.addCategory('category')} color="primary" autoFocus>
              Add Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Sub Category */}
        <Dialog
          open={this.state.openSubCategoryModal}
          onClose={this.handleSubCatClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Sub Category</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="category_name"
              value={this.state.category_name}
              onChange={this.onChange}
              placeholder="Category Name"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleSubCatClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.category_name == ''}
              onClick={(e) => this.addCategory('subcategory')} color="primary" autoFocus>
              Add Sub Category
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Product */}
        <Dialog
          open={this.state.openProductModal}
          onClose={this.handleProductClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Product</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              required
            /><br />
            <TextField
              id="standard-basic"
              type="number"
              autoComplete="off"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              required
            /><br />
            <Input
              id="standard-basic"
              type="file"
              accept="image/*"
              name="file"
              value={this.state.file}
              onChange={this.onChange}
              id="fileInput"
              placeholder="File"
              required
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == '' || this.state.file == null}
              onClick={(e) => this.addProduct()} color="primary" autoFocus>
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by product name"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Discount</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.desc}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.discount}</TableCell>
                  <TableCell align="right">
                    <Button
                      className="button_style"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteProduct(row._id)}
                    >
                      Delete
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination onChange={this.pageChange} count={this.state.pages} color="primary" />
        </TableContainer>

      </div>
    );
  }
} 